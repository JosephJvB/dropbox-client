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
- maybe the cache sets all suggest options???
- handle upload paths better
- can set a download path
- mkdir, mv, delete functions
  - can do a hacky mkdir by uploading to a folder path that doesnt exist yet. eg upload: `/fake-folder/newfile.txt`
