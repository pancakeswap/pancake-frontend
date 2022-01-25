const slugify = (str: string) => {
  return str
    .toLowerCase()
    .replace(/\s/g, '-') // Replace white space
    .replace(/[^a-zA-Z0-9-_]/g, '-') // Replace non alphanum-_ chars
    .replace(/-{2,}/g, '-') // Remove extra -
    .replace(/-$/g, '') // Remove - at the start
    .replace(/^-/g, '') // Remove - at the end
}

export default slugify
