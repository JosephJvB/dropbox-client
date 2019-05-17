// bunch of switch statements to handle all inputs
async function handleFileBrowsing(input) {
  const {
    file,
  } = input;
  if(type === 'file') {
    // prompt select: info, download, cancel
    const choices = 'info, download, cancel'
    const choice = 'prompt(choices)';
    switch(choice) {
      case 'info': return '';
      case 'download': return '';
      case 'cancel': return '';
      default: {
        console.error('wtf?', choice);
        process.exit(1);
      }
    }
  } else if (type === 'folder') {
    // list(currentPath + name)
    const choices = 'list'
    const choice = 'prompt(list)'
    return handleFileBrowsing()
  } else {
    console.error('wtf?', type);
    process.exit(1);
  }
}
