import fs from 'fs/promises';
import path from 'path';
import {authenticate} from '@google-cloud/local-auth';
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
    const content = await fs.readFile(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
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
let drive = google.drive({
    version: 'v3',
    auth: await authorize(),
});

/// utils

export async function uploadGoogleFile(name,mimeType,readStream){
    return new Promise(async (res,rej)=>{
        try{
            const response = await drive.files.create({
                requestBody:{
                    name,
                    mimeType,
                },
                media:{
                    mimeType,
                    body: readStream
                }
            })

            let GoogleID = response.data.id;
            if (!GoogleID) return res('error');

            let url = await getPublickURL(GoogleID);
            if (url==='error') return res('error');

            let result = {
                URL:url,
                googleID:GoogleID,
            }

            res(result)
        }catch(e){
            res('error');
        }
    })
}
export async function removeGoogleFile(googleID){
    return new Promise(async (res,rej)=>{
        try{
            const response = await drive.files.delete({
                fileId: googleID,
            });
            (response.status===204)?res('ok'):res('error');
        }catch(e){
            let message = e.message;
            if (message.includes('File not found')){
                res('ok');
            }else{
                res('error');
            }
        }
    })
}
export async function deleteRemoveList(removeList){
    let promiseArray = [];
    let pesolvedArray = [];

    if (removeList.length>40){
        for(let googleID of removeList){
            promiseArray.push(await removeGoogleFile(googleID));
        }
        pesolvedArray = promiseArray;
    }else{
        for(let googleID of removeList){
            promiseArray.push(removeGoogleFile(googleID));
        }
        pesolvedArray = await Promise.all(promiseArray);
    }

    let errorList=[];

    for(let i=0; i<pesolvedArray.length;i++){
        if (pesolvedArray[i]!=='error') continue;
        errorList.push(promiseArray[i]);
    }

    if (errorList.length===0) return 'ok';
    return errorList;
}

async function getPublickURL(googleID){
    try{
        await drive.permissions.create({
            fileId:googleID,
            requestBody:{
                role:'reader',
                type:'anyone',
            }
        })
    }catch{
        return 'error';
    }

    // let res = await drive.files.get({
    //     fileId:googleID,
    //     fields: 'webContentLink',
    // })
    // let url = res.data.webContentLink;

    let url=`https://drive.google.com/uc?export=view&id=${googleID}`;

    if (url) return url;
    return 'error';
}

export async function getallFilesLastTime(mSecondAgo){
    let res = await drive.files.list({
        fields: 'files(id, name)',
        q:`modifiedTime > '${timeForGoogle(mSecondAgo)}'`,
    });
    let data = await res.data;
    let files = data.files;
    return files;

    function timeForGoogle(num){
        let date = new Date(Date.now()-num);
    
        let year = date.getUTCFullYear();
        let month = date.getUTCMonth()+1;
        let day = date.getUTCDate();
    
        if (month<10) month ='0'+month;
        if (day<10) day ='0'+day;
    
        let h = date.getUTCHours();
        let m = date.getUTCMinutes();
        let s = date.getUTCSeconds();
    
        if (h<10) h ='0'+h;
        if (m<10) m ='0'+m;
        if (s<10) s ='0'+s;
    
    
        return `${year}-${month}-${day}T${h}:${m}:${s}`
    }
}

//

