module.exports = {
    getMetaData: require('./get-info').getMetaData,
    getFolderContents: require('./get-info').getFolderContents,
    handleDownload: require('./download'),
    handleUpload: require('./upload')
};