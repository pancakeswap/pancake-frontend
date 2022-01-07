module.exports = (on) => {
  on('task', {
    log(message) {
      console.info(message)
      return null
    },
  })
}
