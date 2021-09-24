export function getWords(): Array<string>
export function getNums(): Array<number>
export function sumNums(nums: Array<number>): number
export function getCwd(callback: (arg0: string) => void): void
export function readFile(callback: (arg0: Error | undefined, arg1: string | null) => void): void
export function readPackageJson(): PackageJson
export enum Kind { Dog = 0, Cat = 1, Duck = 2 }
export enum CustomNumEnum { One = 1, Two = 2, Three = 3, Four = 4, Six = 6, Eight = 8, Nine = 9, Ten = 10 }
export function enumToI32(e: CustomNumEnum): number
export function throwError(): void
export function mapOption(val: number | null): number | null
export function add(a: number, b: number): number
export function fibonacci(n: number): number
export function listObjKeys(obj: object): Array<string>
export function createObj(): object
export function contains(source: string, target: string): boolean
export function concatStr(mutS: string): string
export function concatUtf16(s: Utf16String): Utf16String
export function concatLatin1(s: Latin1String): string
export class Animal {
  readonly kind: Kind
  constructor(kind: Kind, name: string)
  get name(): string
  set name(name: string)
  whoami(): string
}
export class PackageJson {
  name: string
  version: string
  dependencies: Record<string, string> | null
  devDependencies: Record<string, string> | null
  constructor(name: string, version: string, dependencies: Record<string, string> | null, devDependencies: Record<string, string> | null)
}
