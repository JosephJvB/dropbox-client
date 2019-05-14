# Filessss

home-brewed programmatic dropbox client.

### DONE
- Get single file meta-data
- Get folder contents meta-data
- Upload a single file from local machine
- Upload a single file from url-resource
- Download txtfile by dropbox-path or id
- Download imagefile by dropbox-path or id
- Add base CLI framework [meow](https://www.npmjs.com/package/meow)
- Download image / file controlled by handleDownload
- create handleUpload to manage the two upload functions
- split lib.js into modules under `/lib/`

### TODO
- handle dropbox token with writefile if no token exists.
- make commandline-list-interface for download function.
- make CLI nicer
    - spinners: [ora](https://github.com/sindresorhus/ora)
    - scrollable select screen like in [glyrics](https://github.com/candh/glyrics)
- Create something tidier than current log function.
- Batch upload/download?