# Dropbox-cli

Please use this package instead of mine, thanks!  
https://github.com/andreafabrizi/Dropbox-Uploader

### Requirements
- Node
- dropbox-app Authorization token: generate from their [app console](https://www.dropbox.com/developers/apps?_tk=pilot_lp&_ad=topbar4&_camp=myapps)

### Install 
`npm i -g jvb-cli-dbx` or by yarn / your package manager.

### Usage:
```sh
dbx <action> [file] [options]
```

im making constant changes, the switch statement in ./index.js is the most reliable source of truth.


### TODO
- refactor this future joe it's your problem now!!
- use [blessed](https://github.com/chjj/blessed) to clear and rewrite in the same 'screen'
  - `console.log('\033[2J')` clears screen?
- can set a download path
- Batch upload/download?
