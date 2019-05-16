# Filessss

home-brewed dropbox cli.

Just found this https://github.com/andreafabrizi/Dropbox-Uploader

Please use this package instead of mine, thanks!

### DONE
- Get single file meta-data
- Get folder contents meta-data
- Upload a single file from local machine
- Upload a single file from url-resource
- Download txtfile by dropbox-path or id
- Download imagefile by dropbox-path or id
- Download image / file controlled by handleDownload
- create handleUpload to manage the two upload functions
- split lib.js into modules under `/lib/`
- handle dropbox token with writefile if no token exists.
- make commandline-list-interface for download function.
    - use prompts.js to choose file for download
    - also for renaming files on upload/download

### TODO
- make CLI nicer
    - spinners: [ora](https://github.com/sindresorhus/ora)
    - scrollable select screen like in [glyrics](https://github.com/candh/glyrics)
        - uses: [blessed](https://github.com/chjj/blessed)
- Create something tidier than current log function.
- Batch upload/download?
