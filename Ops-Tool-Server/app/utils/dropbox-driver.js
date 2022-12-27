const dropboxV2Api = require('dropbox-v2-api');
const fs = require('fs');
const appRoot = require('app-root-path');
const strFilePath = `${appRoot}/uploads/input/`;
// const path = require('path');
const dropbox = dropboxV2Api.authenticate({
    token: ''
});

const downloadDropboxFile = async (file, callback) => {
    const [, fileValue] = file.match(/.*\/(.*)$/);
    const [originalFilename] = fileValue.split('?');
    const filename = decodeURIComponent(originalFilename);
    const filepath = `${strFilePath}${filename}`;

    await dropbox({
        resource: 'sharing/get_shared_link_file',
        parameters: {
            url: file
        }
    }, (err, result, response) => {
        if (err) {
            callback(err);
        }

        console.log('File Metadata =========================> ', JSON.stringify(result));

    }).pipe(fs.createWriteStream(filepath));

    console.log('File downloaded =========================> ', filepath);
    callback(null, filename);
}


module.exports = { downloadDropboxFile }