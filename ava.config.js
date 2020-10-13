import { platform } from 'os'

const platformName = platform()

const configuration = {
  extensions: ['ts', 'tsx'],
  files: ['test_module/__test__/**/*.spec.ts'],
  require: [
    platformName === 'freebsd'
      ? 'ts-node/register/transpile-only'
      : '@swc-node/register',
  ],
  environmentVariables: {
    SWC_NODE_PROJECT: './test_module/tsconfig.json',
  },
}

if (parseInt(process.versions.napi, 10) < 4) {
  configuration.compileEnhancements = false
}

export default configuration
