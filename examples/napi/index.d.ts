/* tslint:disable */
/* eslint-disable */

/* auto-generated by NAPI-RS */

export class ExternalObject<T> {
  readonly '': {
    readonly '': unique symbol
    [K: symbol]: T
  }
}
/** This is a const */
export const DEFAULT_COST: number
export function getWords(): Array<string>
/** Gets some numbers */
export function getNums(): Array<number>
export function sumNums(nums: Array<number>): number
export function toJsObj(): object
export function readFileAsync(path: string): Promise<Buffer>
export function asyncMultiTwo(arg: number): Promise<number>
export function bigintAdd(a: bigint, b: bigint): bigint
export function createBigInt(): bigint
export function createBigIntI64(): bigint
export function bigintGetU64AsString(bi: bigint): string
export function getCwd(callback: (arg0: string) => void): void
export function optionEnd(callback: (arg0: string, arg1?: string | undefined | null) => void): void
export function optionStart(callback: (arg0: string | undefined | null, arg1: string) => void): void
export function optionStartEnd(callback: (arg0: string | undefined | null, arg1: string, arg2?: string | undefined | null) => void): void
export function optionOnly(callback: (arg0?: string | undefined | null) => void): void
/** napi = { version = 2, features = ["serde-json"] } */
export function readFile(callback: (arg0: Error | undefined, arg1?: string | undefined | null) => void): void
export function returnJsFunction(): (...args: any[]) => any
export function callbackReturnPromise<T>(functionInput: () => T | Promise<T>, callback: (err: Error | null, result: T) => void): T | Promise<T>
export function dateToNumber(input: Date): number
export function chronoDateToMillis(input: Date): number
export function chronoDateAdd1Minute(input: Date): Date
export interface Dates {
  start: Date
  end?: Date
}
export function eitherStringOrNumber(input: string | number): number
export function returnEither(input: number): string | number
export function either3(input: string | number | boolean): number
export interface Obj {
  v: string | number
}
export function either4(input: string | number | boolean | Obj): number
export function receiveClassOrNumber(either: number | JsClassForEither): number
export function receiveMutClassOrNumber(either: number | JsClassForEither): number
/** default enum values are continuos i32s start from 0 */
export const enum Kind {
  /** Barks */
  Dog = 0,
  /** Kills birds */
  Cat = 1,
  /** Tasty */
  Duck = 2
}
export const enum Empty {
  
}
/** You could break the step and for an new continuous value. */
export const enum CustomNumEnum {
  One = 1,
  Two = 2,
  Three = 3,
  Four = 4,
  Six = 6,
  Eight = 8,
  Nine = 9,
  Ten = 10
}
export function enumToI32(e: CustomNumEnum): number
export function throwError(): void
export function createExternal(size: number): ExternalObject<number>
export function createExternalString(content: string): ExternalObject<string>
export function getExternal(external: ExternalObject<number>): number
export function mutateExternal(external: ExternalObject<number>, newVal: number): void
export function validateArray(arr: Array<number>): number
export function validateBuffer(b: Buffer): number
export function validateTypedArray(input: Uint8Array): number
export function validateBigint(input: bigint): bigint
export function validateBoolean(i: boolean): boolean
export function validateDate(d: Date): number
export function validateDateTime(d: Date): number
export function validateExternal(e: ExternalObject<number>): number
export function validateFunction(cb: () => number): number
export function validateHashMap(input: Record<string, number>): number
export function validateNull(i: null): boolean
export function validateUndefined(i: undefined): boolean
export function validateNumber(i: number): number
export function validatePromise(p: Promise<number>): Promise<number>
export function validateString(s: string): string
export function validateSymbol(s: symbol): boolean
export function tsRename(a: { foo: number }): string[]
export function xxh64Alias(input: Buffer): bigint
export function getMapping(): Record<string, number>
export function sumMapping(nums: Record<string, number>): number
export function mapOption(val?: number | undefined | null): number | null
export function returnNull(): null
export function returnUndefined(): void
export function add(a: number, b: number): number
export function fibonacci(n: number): number
export function listObjKeys(obj: object): Array<string>
export function createObj(): object
export function getGlobal(): typeof global
export function getUndefined(): void
export function getNull(): null
export interface AllOptionalObject {
  name?: string
  age?: number
}
export function receiveAllOptionalObject(obj?: AllOptionalObject | undefined | null): void
export const enum ALIAS {
  A = 0,
  B = 1
}
export interface AliasedStruct {
  a: ALIAS
  b: number
}
export function fnReceivedAliased(s: AliasedStruct, e: ALIAS): void
export interface StrictObject {
  name: string
}
export function receiveStrictObject(strictObject: StrictObject): void
export function getStrFromObject(): void
export interface TsTypeChanged {
  typeOverride: object
  typeOverrideOptional?: object
}
export function createObjWithProperty(): { value: ArrayBuffer, get getter(): number }
export function getterFromObj(): number
export function asyncPlus100(p: Promise<number>): Promise<number>
/** This is an interface for package.json */
export interface PackageJson {
  name: string
  /** The version of the package */
  version: string
  dependencies?: Record<string, any>
  devDependencies?: Record<string, any>
}
export function readPackageJson(): PackageJson
export function getPackageJsonName(packageJson: PackageJson): string
export function testSerdeRoundtrip(data: any): any
export function contains(source: string, target: string): boolean
export function concatStr(s: string): string
export function concatUtf16(s: string): string
export function concatLatin1(s: string): string
export function roundtripStr(s: string): string
export function setSymbolInObj(symbol: symbol): object
export function createSymbol(): symbol
export function withoutAbortController(a: number, b: number): Promise<number>
export function withAbortController(a: number, b: number, signal: AbortSignal): Promise<number>
export function callThreadsafeFunction(callback: (...args: any[]) => any): void
export function threadsafeFunctionThrowError(cb: (...args: any[]) => any): void
export function threadsafeFunctionFatalMode(cb: (...args: any[]) => any): void
export function threadsafeFunctionFatalModeError(cb: (...args: any[]) => any): void
export function getBuffer(): Buffer
export function appendBuffer(buf: Buffer): Buffer
export function getEmptyBuffer(): Buffer
export function convertU32Array(input: Uint32Array): Array<number>
export function createExternalTypedArray(): Uint32Array
export function mutateTypedArray(input: Float32Array): void
export function derefUint8Array(a: Uint8Array, b: Uint8ClampedArray): number
export function bufferPassThrough(buf: Buffer): Promise<Buffer>
export function asyncReduceBuffer(buf: Buffer): Promise<number>
/**
 * `constructor` option for `struct` requires all fields to be public,
 * otherwise tag impl fn as constructor
 * #[napi(constructor)]
 */
export class Animal {
  /** Kind of animal */
  readonly kind: Kind
  /** This is the constructor */
  constructor(kind: Kind, name: string)
  /** This is a factory method */
  static withKind(kind: Kind): Animal
  get name(): string
  set name(name: string)
  /**
   * This is a
   * multi-line comment
   * with an emoji 🚀
   */
  whoami(): string
  /** This is static... */
  static getDogKind(): Kind
  /**
   * Here are some characters and character sequences
   * that should be escaped correctly:
   * \[]{}/\:""
   */
  returnOtherClass(): Dog
  returnOtherClassWithCustomConstructor(): Bird
}
export class Dog {
  name: string
  constructor(name: string)
}
export class Bird {
  name: string
  constructor(name: string)
  getCount(): number
}
export type Blake2bHasher = Blake2BHasher
/** Smoking test for type generation */
export class Blake2BHasher {
  static withKey(key: Blake2bKey): Blake2BHasher
  update(data: Buffer): void
}
export type Blake2bKey = Blake2BKey
export class Blake2BKey { }
export class Context {
  maybeNeed?: boolean
  constructor()
  static withData(data: string): Context
  method(): string
}
export class AnimalWithDefaultConstructor {
  name: string
  kind: number
  constructor(name: string, kind: number)
}
export class NinjaTurtle {
  name: string
  /** Create your ninja turtle! 🐢 */
  static newRaph(): NinjaTurtle
  getMaskColor(): string
  getName(): string
}
export type JsAssets = Assets
export class Assets {
  constructor()
  get(id: number): JsAsset | null
}
export type JsAsset = Asset
export class Asset {
  constructor()
  get filePath(): number
}
export class Optional {
  static optionEnd(required: string, optional?: string | undefined | null): string
  static optionStart(optional: string | undefined | null, required: string): string
  static optionStartEnd(optional1: string | undefined | null, required: string, optional2?: string | undefined | null): string
  static optionOnly(optional?: string | undefined | null): string
}
export class ClassWithFactory {
  name: string
  static withName(name: string): ClassWithFactory
  setName(name: string): this
}
export class JsClassForEither {
  constructor()
}
export class Fib {
  [Symbol.iterator](): Iterator<number, void, number>
  constructor()
}
export class JsRepo {
  constructor(dir: string)
  remote(): JsRemote
}
export class JsRemote {
  name(): string
}
export type CSSRuleList = CssRuleList
export class CssRuleList {
  getRules(): Array<string>
}
export type CSSStyleSheet = CssStyleSheet
export class CssStyleSheet {
  constructor(rules: Array<string>)
  get rules(): CssRuleList
  anotherCssStyleSheet(): AnotherCssStyleSheet
}
export type AnotherCSSStyleSheet = AnotherCssStyleSheet
export class AnotherCssStyleSheet {
  get rules(): CssRuleList
}
export namespace xxh3 {
  export const ALIGNMENT: number
  export function xxh3_64(input: Buffer): bigint
  /** xxh128 function */
  export function xxh128(input: Buffer): bigint
  /** Xxh3 class */
  export class Xxh3 {
    constructor()
    /** update */
    update(input: Buffer): void
    digest(): bigint
  }
}
export namespace xxh2 {
  export function xxh2Plus(a: number, b: number): number
  export function xxh3Xxh64Alias(input: Buffer): bigint
}
