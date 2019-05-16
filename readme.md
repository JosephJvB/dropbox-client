# Dropbox-cli

Please use this package instead of mine, thanks!  
https://github.com/andreafabrizi/Dropbox-Uploader

### Setup dropbox app

*You **must** set up a dropbox 'app' from the [app console](https://www.dropbox.com/developers/apps?_tk=pilot_lp&_ad=topbar4&_camp=myapps)* to use this cli.

My suggestions for completing the 'create app' flow:
> Please dont give full dropbox access, I wrote this software, it's weird at best, terrible at worst.
- Dropbox API
- App folder, NOT full access!
- \- choose a folder name -

Copy your generated Authorization token, you will need to enter this to authorize the cli to make changes to your dropbox folder.

### Install 
`npm i -g jvb-cli-dbx` or by yarn / your package manager.

### Usage:
`dbx <action> [file] [options]`
- Upload
    - Alias: upload, up, u
    ```sh
    dbx up ./your-file.txt
    ```
    ```sh
    dbx up https://twitter_screenshot_069420.png
    ```
    ```sh
    dbx up ./precious-file.txt --as safe-now.txt
    ```

- Download
    - Alias: download, down, dl, d
    ```
    dbx download
    ```

- Meta data
    - Alias: meta, m
    - CANT get meta for root '/'
    ```sh
    dbx meta ./my-file.txt
    ```

- Folder contents
    - Alias: contents, c
    ```sh
    # add -v or --verbose for more info on each item
    dbx contents /my-folder
    ```

### TODO
- make CLI nicer
    - spinners: [ora](https://github.com/sindresorhus/ora)
    - scrollable select screen like in [glyrics](https://github.com/candh/glyrics)
        - uses: [blessed](https://github.com/chjj/blessed)
- Create something tidier than current log function.
- Batch upload/download?
