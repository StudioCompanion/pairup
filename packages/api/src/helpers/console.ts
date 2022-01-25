/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */

const isNotTest = process.env.ENV !== 'test'

export class Logger {
  static log(...args: any[]) {
    if (isNotTest) {
      console.log(...args)
    }
  }

  static error(...args: any[]) {
    if (isNotTest) {
      console.error(...args)
    }
  }

  static warn(...args: any[]) {
    if (isNotTest) {
      console.warn(...args)
    }
  }
}
