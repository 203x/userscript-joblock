declare module '*.html' {
  const content: string
  export default content
}

declare module '*.scss' {
  const classes: string
  export default classes
}

declare module '*.yaml' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const classes: any
  export default classes
}

declare module '*.svelte' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const classes: any
  export default classes
}
