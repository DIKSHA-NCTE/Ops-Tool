var fs = require('fs');
var appRoot = require('app-root-path');
var path = require('path');
var _ = require('lodash');
var { google } = require('googleapis');
var strFilePath = `${appRoot}/uploads/input/`;
var outputFilePath = `${appRoot}/uploads/streamedOutput/`;
var logger = require("../../config/winston");

const SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly'
];

// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const credentials = `${appRoot}/credentials.json`;
const TOKEN_PATH = `${appRoot}/token.json`;
const AUTH_CODE = "";


let Auth = function (callback) {
  // Load client secrets from a local file.`
  fs.readFile(credentials, (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Drive API.
    authorize(JSON.parse(content), function (auth) {
      callback(auth);
    });
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getAccessToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });

  oAuth2Client.getToken(AUTH_CODE, (err, token) => {
    if (err) return console.error('Error retrieving access token', err);
    oAuth2Client.setCredentials(token);
    // Store the token to disk for later program executions
    fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
      if (err) console.error(err);
    });
    callback(oAuth2Client);
  });

}

/**
 * Lists the names and IDs of up to 10 files.
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

let downloadFiles = function (fileId, format, callback) {
  Auth((auth) => {
    const drive = google.drive({ version: 'v3', auth });
    drive.files.get({
      fileId: fileId,
      supportsAllDrives: true
    }, (err, { data }) => {
      if (err) return callback(err);
      let extension = path.extname(data.name);
      let fileId = data.id;
      let fileName = fileId + extension;
      let filePath = strFilePath + fileName;
      let opPath = outputFilePath + fileName;
      var dest = fs.createWriteStream(filePath);
      drive.files.get(
        { fileId: fileId, alt: 'media' }, 
        { responseType: 'stream' },
        ((err, res) => {
          let progress = 0;
          res.data
            .on('end', () => {
              console.log('Done downloading file.');
              callback(null, fileName);
            })
            .on('error', err => {
              console.error('Error downloading file.');
              callback(err);
            })
            .on('data', d => {
              progress += d.length;
              if (process.stdout.isTTY) {
                process.stdout.clearLine();
                process.stdout.cursorTo(0);
                process.stdout.write(`Downloaded ${progress} bytes`);
              }
            })
            .pipe(dest)
            //.pipe(dest2);
        })
    )});
  });
};

  /**
   * Print a file's metadata.
   *
   * @param {String} fileId ID of the file to print metadata for.
   */
  let printFile = function (fileId) {
    var request = google.drive.files.get({
      'fileId': fileId
    });
    request.execute(function (resp) {
      console.log(resp);
      console.log('Title: ' + resp.title);
      console.log('Description: ' + resp.description);
      console.log('MIME type: ' + resp.mimeType);
    });
  }

  module.exports = { printFile, downloadFiles }