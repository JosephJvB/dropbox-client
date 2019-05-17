const prompts = require('prompts');

const listContents = require('./list');

module.exports = async function startInteractive (identifier = '') {
  const conts = await listContents(identifier, true);
  const choice = await prompts({
      type: 'text',
      name: 'idx',
      message: conts.data.reduce((str, entry, i) => {
          return str += `    ${i + 1}: [${entry['.tag']}] ${entry.name}\n`
      }, `~/Apps/joe-van-bot${identifier || '/'}\n\n    Select by number:\n\n`)
  }, {
      onCancel: () => process.exit(0)
  });

  // super wip-ish
  const pathArr = identifier.split('/');
  if(!Number(choice.idx) && choice.idx.trim().toLowerCase() === 'back') {
    return startInteractive(pathArr.slice(0, pathArr.length - 1).join('/'))
  }

  if(Number(choice.idx) > conts.data.length || Number(choice.idx) <= 0) {
      throw new Error('Invalid choice: index out of bounds');
  }

  const chosen = conts.data[choice.idx - 1];
  if(chosen['.tag'] === 'folder') {
      return startInteractive(chosen.path_display);
  } else {
      // choose action here
      return lib.getMetaData(chosen.id)
  }
}