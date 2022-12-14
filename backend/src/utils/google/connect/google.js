import fs from 'fs/promises';
import path from 'path';
import {authenticate} from '@google-cloud/local-auth';
import {credentials} from './credentials.js';
import {google} from 'googleapis';
import __dirname from './__dirname.js';

const SCOPES = ['https://www.googleapis.com/auth/drive'];
const TOKEN_PATH = path.join(__dirname, 'token.json');
const CREDENTIALS_PATH = path.join(__dirname, 'credentials.json');

async function loadSavedCredentialsIfExist() {
    try {
      const content = await fs.readFile(TOKEN_PATH);
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
}
async function saveCredentials(client) {
    const keys = credentials;
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFile(TOKEN_PATH, payload);
}
async function authorize() {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
      return client;
    }
    client = await authenticate({
      scopes: SCOPES,
      keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
      await saveCredentials(client);
    }
    return client;
}
export const drive = await google.drive({
  version: 'v3',
  auth: await authorize(),
});

// export const drive = await google.drive({
//   version: 'v3',
//   auth: 'AIzaSyCF8vXJXHFAuId7vBH80DCV7mN7a7wYujQ',
// });