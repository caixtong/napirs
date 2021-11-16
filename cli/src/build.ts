import { execSync } from 'child_process'
import { join, parse, sep } from 'path'

import { Instance } from 'chalk'
import { Command, Option } from 'clipanion'
import toml from 'toml'

import { getNapiConfig } from './consts'
import { debugFactory } from './debug'
import { createJsBinding } from './js-binding-template'
import { getDefaultTargetTriple, parseTriple } from './parse-triple'
import {
  copyFileAsync,
  existsAsync,
  mkdirAsync,
  readFileAsync,
  unlinkAsync,
  writeFileAsync,
} from './utils'

const debug = debugFactory('build')
const chalk = new Instance({ level: 1 })

export class BuildCommand extends Command {
  static usage = Command.Usage({
    description: 'Build and copy native module into specified dir',
  })

  static paths = [['build']]

  appendPlatformToFilename = Option.Boolean(`--platform`, false, {
    description: `Add platform triple to the .node file. ${chalk.green(
      '[name].linux-x64-gnu.node',
    )} for example`,
  })

  isRelease = Option.Boolean(`--release`, false, {
    description: `Bypass to ${chalk.green('cargo --release')}`,
  })

  configFileName?: string = Option.String('--config,-c', {
    description: `napi config path, only JSON format accepted. Default to ${chalk.underline(
      chalk.green('package.json'),
    )}`,
  })

  cargoName?: string = Option.String('--cargo-name', {
    description: `Override the ${chalk.green(
      'name',
    )} field in ${chalk.underline(chalk.yellowBright('Cargo.toml'))}`,
  })

  targetTripleDir = Option.String('--target', process.env.RUST_TARGET ?? '', {
    description: `Bypass to ${chalk.green('cargo --target')}`,
  })

  features?: string = Option.String('--features', {
    description: `Bypass to ${chalk.green('cargo --features')}`,
  })

  dts?: string = Option.String('--dts', 'index.d.ts', {
    description: `The filename and path of ${chalk.green(
      '.d.ts',
    )} file, relative to cwd`,
  })

  cargoFlags = Option.String('--cargo-flags', '', {
    description: `All the others flag passed to ${chalk.yellow('cargo')}`,
  })

  jsBinding = Option.String('--js', 'index.js', {
    description: `Path to the JS binding file, pass ${chalk.underline(
      chalk.yellow('false'),
    )} to disable it`,
  })

  cargoCwd?: string = Option.String('--cargo-cwd', {
    description: `The cwd of ${chalk.underline(
      chalk.yellow('Cargo.toml'),
    )} file`,
  })

  destDir = Option.String({
    required: false,
  })

  async execute() {
    const cwd = this.cargoCwd
      ? join(process.cwd(), this.cargoCwd)
      : process.cwd()
    const releaseFlag = this.isRelease ? `--release` : ''
    const targetFlag = this.targetTripleDir
      ? `--target ${this.targetTripleDir}`
      : ''
    const featuresFlag = this.features ? `--features ${this.features}` : ''
    const triple = this.targetTripleDir
      ? parseTriple(this.targetTripleDir)
      : getDefaultTargetTriple(
          execSync('rustup show active-toolchain', {
            env: process.env,
          }).toString('utf8'),
        )
    debug(`Current triple is: ${chalk.green(triple.raw)}`)
    const externalFlags = [
      releaseFlag,
      targetFlag,
      featuresFlag,
      this.cargoFlags,
    ]
      .filter((flag) => Boolean(flag))
      .join(' ')
    const cargoCommand = `cargo build ${externalFlags}`
    const intermediateTypeFile = join(__dirname, `type_def.${Date.now()}.tmp`)
    debug(`Run ${chalk.green(cargoCommand)}`)
    execSync(cargoCommand, {
      env: {
        ...process.env,
        TYPE_DEF_TMP_PATH: intermediateTypeFile,
      },
      stdio: 'inherit',
      cwd,
    })
    const { binaryName, packageName } = getNapiConfig(this.configFileName)
    let dylibName = this.cargoName
    if (!dylibName) {
      let tomlContentString: string
      let tomlContent: any
      try {
        debug('Start read toml')
        tomlContentString = await readFileAsync(
          join(cwd, 'Cargo.toml'),
          'utf-8',
        )
      } catch {
        throw new TypeError(`Could not find Cargo.toml in ${cwd}`)
      }

      try {
        debug('Start parse toml')
        tomlContent = toml.parse(tomlContentString)
      } catch {
        throw new TypeError('Could not parse the Cargo.toml')
      }

      if (tomlContent.package?.name) {
        dylibName = tomlContent.package.name.replace(/-/g, '_')
      } else {
        throw new TypeError('No package.name field in Cargo.toml')
      }

      if (!tomlContent.lib?.['crate-type']?.includes?.('cdylib')) {
        throw new TypeError(
          `Missing ${chalk.green('create-type = ["cdylib"]')} in ${chalk.green(
            '[lib]',
          )}`,
        )
      }
    }

    debug(`Dylib name: ${chalk.greenBright(dylibName)}`)

    const platform = triple.platform
    let libExt

    debug(`Platform: ${chalk.greenBright(platform)}`)

    // Platform based massaging for build commands
    switch (platform) {
      case 'darwin':
        libExt = '.dylib'
        dylibName = `lib${dylibName}`
        break
      case 'win32':
        libExt = '.dll'
        break
      case 'linux':
      case 'freebsd':
      case 'openbsd':
      case 'android':
      case 'sunos':
        dylibName = `lib${dylibName}`
        libExt = '.so'
        break
      default:
        throw new TypeError(
          'Operating system not currently supported or recognized by the build script',
        )
    }

    const targetRootDir = await findUp(cwd)

    if (!targetRootDir) {
      throw new TypeError('No target dir found')
    }

    const targetDir = join(
      this.targetTripleDir,
      this.isRelease ? 'release' : 'debug',
    )

    const platformName = this.appendPlatformToFilename
      ? `.${triple.platformArchABI}`
      : ''

    debug(`Platform name: ${platformName || chalk.green('[Empty]')}`)
    const distFileName = `${binaryName}${platformName}.node`

    const distModulePath = join(this.destDir ?? '.', distFileName)

    const parsedDist = parse(distModulePath)

    if (parsedDist.dir && !(await existsAsync(parsedDist.dir))) {
      await mkdirAsync(parsedDist.dir, { recursive: true }).catch((e) => {
        console.warn(
          chalk.bgYellowBright(
            `Create dir [${parsedDist.dir}] failed, reason: ${e.message}`,
          ),
        )
      })
    }

    const sourcePath = join(
      targetRootDir,
      'target',
      targetDir,
      `${dylibName}${libExt}`,
    )

    if (await existsAsync(distModulePath)) {
      debug(`remove old binary [${chalk.yellowBright(distModulePath)}]`)
      await unlinkAsync(distModulePath)
    }

    debug(`Write binary content to [${chalk.yellowBright(distModulePath)}]`)
    await copyFileAsync(sourcePath, distModulePath)

    const idents = await processIntermediateTypeFile(
      intermediateTypeFile,
      join(this.destDir ?? '.', this.dts ?? 'index.d.ts'),
    )
    await writeJsBinding(
      binaryName,
      packageName,
      this.jsBinding && this.jsBinding !== 'false'
        ? join(process.cwd(), this.jsBinding)
        : null,
      idents,
    )
  }
}

async function findUp(dir = process.cwd()): Promise<string | null> {
  const dist = join(dir, 'target')
  if (await existsAsync(dist)) {
    return dir
  }
  const dirs = dir.split(sep)
  if (dirs.length < 2) {
    return null
  }
  dirs.pop()
  return findUp(dirs.join(sep))
}

interface TypeDef {
  kind: 'fn' | 'struct' | 'impl' | 'enum' | 'interface'
  name: string
  def: string
}

async function processIntermediateTypeFile(
  source: string,
  target: string,
): Promise<string[]> {
  const idents: string[] = []
  if (!(await existsAsync(source))) {
    debug(`do not find tmp type file. skip type generation`)
    return idents
  }

  const tmpFile = await readFileAsync(source, 'utf8')
  const lines = tmpFile
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  let dts = ''
  const classes = new Map<string, string>()
  const impls = new Map<string, string>()

  lines.forEach((line) => {
    const def = JSON.parse(line) as TypeDef

    switch (def.kind) {
      case 'struct':
        idents.push(def.name)
        classes.set(def.name, def.def)
        break
      case 'impl':
        impls.set(def.name, def.def)
        break
      case 'interface':
        dts += `interface ${def.name} {\n${indentLines(def.def, 2)}\n}\n`
        break
      default:
        idents.push(def.name)
        dts += def.def + '\n'
    }
  })

  for (const [name, classDef] of classes.entries()) {
    const implDef = impls.get(name)

    dts += `export class ${name} {\n${indentLines(classDef, 2)}`

    if (implDef) {
      dts += `\n${indentLines(implDef, 2)}`
    }

    dts += '\n}\n'
  }

  await unlinkAsync(source)
  await writeFileAsync(target, dts, 'utf8')
  return idents
}

function indentLines(input: string, spaces: number) {
  return input
    .split('\n')
    .map((line) => ''.padEnd(spaces, ' ') + line.trim())
    .join('\n')
}

async function writeJsBinding(
  localName: string,
  packageName: string,
  distFileName: string | null,
  idents: string[],
) {
  if (distFileName) {
    const template = createJsBinding(localName, packageName)
    const declareCodes = `const { ${idents.join(', ')} } = nativeBinding\n`
    const exportsCode = idents.reduce((acc, cur) => {
      return `${acc}\nmodule.exports.${cur} = ${cur}`
    }, '')
    await writeFileAsync(
      distFileName,
      template + declareCodes + exportsCode + '\n',
      'utf8',
    )
  }
}
