const fs = require('fs')

let distFile = ''

export default function addStyle() {
  return {
    name: 'addStyle',
    renderStart({ file }) {
      distFile = file
    },
    writeBundle(bundle) {
      let css = ''
      for (const key in bundle) {
        const info = bundle[key]
        if (info.type === 'asset' && info.fileName.endsWith('.css')) {
          const { source } = info
          let { fileName } = info
          const dist = distFile.split('/')
          if (dist.length > 1) {
            dist[dist.length - 1] = fileName
            fileName = dist.join('/')
          }
          fs.unlink(fileName, err => {
            if (err) throw err
          })
          css += source.toString() + '\n'
        }
      }
      css = new Buffer.from(`\nGM_addStyle(\`${css}\`);`)
      fs.appendFile(distFile, css, err => {
        if (err) throw err
      })
    },
  }
}
