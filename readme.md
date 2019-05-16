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
- can set a download path
- can reset/unset authorization token
- scrollable select screen like in [glyrics](https://github.com/candh/glyrics)
    - uses: [blessed](https://github.com/chjj/blessed)
    - full scrolling, selectable UI: contents of root folder, selecting another folder gets the contents of THAT folder
    - i dunno. I could go far with that stuff...
- Create something tidier than current log function.
- Batch upload/download?
