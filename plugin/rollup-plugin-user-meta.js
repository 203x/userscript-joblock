import YAML from 'js-yaml'
const fs = require('fs')

function meta2str(data) {
  const start = '==UserScript=='
  const end = '==/UserScript=='
  let usm = []

  for (const key in data) {
    const element = data[key]
    if (Array.isArray(element)) {
      for (const iterator of element) {
        usm.push(`@${key} ${iterator}`)
      }
    } else {
      usm.push(`@${key} ${element}`)
    }
  }

  return [start, ...usm, end].map((text) => '// ' + text).join('\n') + '\n'
}

export default function userMeta(options = {}) {
  return {
    name: 'user-meta',
    banner() {
      if (options.path) {
        let meta = YAML.safeLoad(fs.readFileSync(options.path, 'utf8'))
        if (options.version) {
          let version = meta.version.split('.')
          if (version.length > 0) {
            const ver = Date.now()
            version[version.length - 1] = ver
            meta.version = version.join('.')
            console.log(`${meta.name}: ${meta.version}`)
          }
        }
        return meta2str(meta)
      }
      return null
    },
  }
}
