module.exports = function clearScreen () {
  // https://stackoverflow.com/questions/9006988/node-js-on-windows-how-to-clear-console#answer-9452971
  const [x, y] = process.stdout.getWindowSize();
  for(let i = 0; i < y; i++) {
      console.log('\033c');
  }
}