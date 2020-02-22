import App from './App.svelte'
import styleCss from './style/style.scss'
styleCss

const start = function(): void {

  const ContainerApp = document.createElement('DIV')
  ContainerApp.setAttribute('id', 'x-joblock')
  document.body.appendChild(ContainerApp)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const app = new App({
    target: ContainerApp,
  })
}

if (document.readyState !== 'loading') {
  start()
} else {
  document.addEventListener('DOMContentLoaded', start)
}
