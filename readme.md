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
dbx connect
```
```sh
dbx token:set
dbx token:destroy
```


### TODO
- refactor please, this is gross
- bring back download rename prompt
- can set a download path
- can upload to a folder when 'in' a folder
- EXTRA: move files, create directories etc
- EXTRA: instead of being select prompt, use a text prompt
  - then inside text prompt allow cmds like
    - ls -> select file outputs info
    - download -> select file does download
    - upload -> upload a file to current dir
    - cd -> changes "current file path"
  - it's a cli in a cli