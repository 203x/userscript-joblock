/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Tampermonkey API
// https://www.tampermonkey.net/documentation.php

// Greasemonkey API
// https://sourceforge.net/p/greasemonkey/wiki

declare global {
  const GM_log: (message: any) => void
  const GM_addStyle: (css: string) => void
  const GM_getValue: <R = any>(name: string, defaultValue?: R) => R
  const GM_setValue: (name: string, value: any) => void
  const GM_registerMenuCommand: (name: string, fn: () => void, accessKey?: string) => any
  const GM_unregisterMenuCommand: (menuCmdId: any) => void
}

export {}
