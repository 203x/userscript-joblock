const fs = require('fs')

export default function addStyle() {
  return {
    name: 'addStyle',
    generateBundle(options, bundle) {
      for (const key in bundle) {
        const info = bundle[key]
        if (info.fileName.endsWith('.css')) {
          const temp = info.fileName.split('.')
          temp[temp.length - 1] = 'js'
          const findKey = temp.join('.')

          const css = info.source.toString() + '\n'
          if (bundle[findKey]) {
            bundle[findKey].code += `\nGM_addStyle(\`${css}\`);`
          }
        }
      }
    },
  }
}
