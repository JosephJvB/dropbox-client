const prompts = require('prompts');

const lib = require('./');

module.exports = async function startInteractive (identifier = '') {
  const conts = await lib.listContents(identifier, true);
  const choice = await prompts({
      type: 'text',
      name: 'idx',
      message: conts.data.reduce((str, entry, i) => {
          return str += `    ${i + 1}: [${entry['.tag']}] ${entry.name}\n`
      }, `~/Apps/joe-van-bot${identifier || '/'}\n\n    Select by number:\n\n`)
  }, {
      onCancel: () => process.exit(0)
  });
  const chosen = conts.data[choice.idx - 1];
  if(chosen['.tag'] === 'folder') {
      return startInteractive(chosen.path_display);
  } else {
      return lib.getMetaData(chosen.id)
  }
}