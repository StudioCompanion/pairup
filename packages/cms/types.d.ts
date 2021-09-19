/* eslint-disable @typescript-eslint/no-explicit-any */
export declare class Rule {
  static FIELD_REF: symbol
  static array: (def: any) => Rule
  static object: (def: any) => Rule
  static string: (def: any) => Rule
  static number: (def: any) => Rule
  static boolean: (def: any) => Rule
  static dateTime: (def: any) => Rule
  static valueOfField: (path: any) => {
    type: symbol
    path: any
  }
  constructor(typeDef: any)
  FIELD_REF: symbol
  _typeDef: any
  valueOfField(...args: any[]): {
    type: symbol
    path: any
  }
  error(message: string): Rule
  warning(message: string): Rule
  reset(): Rule
  _type: any
  _rules: any
  _message: any
  _required: any
  _level: string | undefined
  _fieldRules: any
  isRequired(): boolean
  clone(): Rule
  cloneWithRules(rules: any): Rule
  merge(rule: any): Rule
  validate(value: any, options?: Record<string, unknown>): Promise<any[]>
  type(targetType: any): Rule
  all(children: any): Rule
  either(children: any): Rule
  optional(): Rule
  required(): Rule
  custom(fn: (args: any) => boolean | string): Rule
  min(len: number): Rule
  max(len: number): Rule
  length(len: number): Rule
  valid(value: any): Rule
  integer(): Rule
  precision(limit: number): Rule
  positive(): Rule
  negative(): Rule
  greaterThan(num: number): Rule
  lessThan(num: number): Rule
  uppercase(): Rule
  lowercase(): Rule
  regex(pattern: any, name: any, opts: any): Rule
  email(options: any): Rule
  uri(opts?: Record<string, unknown>): Rule
  unique(comparator: any): Rule
  reference(): Rule
  block(fn: any): Rule
  fields(rules: any): Rule
  assetRequired(): Rule
}
