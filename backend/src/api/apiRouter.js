import express from 'express';
import {saveBook, deleteBook, editBook, cancelEdit, sendFileToGoogle} from './editHandlers.js';
import {getBookData,getBookMap,getBooksData} from './getDataHandlers.js';
import { login, auth } from './authHandlers.js';

export const apiRouter = express.Router();

apiRouter.get('/getbookdata/:href',getBookData);
apiRouter.get('/getbookmap/:href',getBookMap);
apiRouter.get('/getbooks/:search',getBooksData);
apiRouter.get('/getbooks',getBooksData);

apiRouter.post('/sendfile',sendFileToGoogle);
apiRouter.post('/save',saveBook);
apiRouter.post('/delete',deleteBook);
apiRouter.post('/edit',editBook);
apiRouter.post('/cancel',cancelEdit);

apiRouter.post('/login',login);
apiRouter.post('/auth',auth);