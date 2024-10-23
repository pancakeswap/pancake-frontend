export const debugLogger = (category: string) => {
  return (...args: any[]) => {
    const color = 'blue'
    // Create a CSS style string for the given color
    const css = `color: ${color}; font-weight: bold;`

    // Log the message with the styles
    const header = `%c[${category}]`
    console.debug(header, css, ...args)
  }
}
