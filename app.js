import 'dotenv/config';
import express from 'express';
import bodyParser from 'body-parser';
import ejsLocals from 'ejs-locals';
import Session from 'express-session';
import ConnectPg from 'connect-pg-simple';
import flash from 'connect-flash';
import Http from 'http';
import Https from 'https';
import mongoose from 'mongoose';

import './config/database';
import configRouter from './config/routes';
import useHelpers from './infrastructure/Helpers/LocalHelpers';
import configSocket from './infrastructure/Helpers/SocketHelper';

const app = express();
const http = process.env.APP_ENV ? Http.Server(app) : Https.Server(app);

configSocket(http);

const PostgreSqlStore = ConnectPg(Session);
const session = Session({
  secret: process.env.SESSION_SECRET,
  name: 'hackathon.session',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: parseInt(process.env.SESSION_LIFETIME, 10) * 1000
  },
  store: new PostgreSqlStore({
    conString: process.env.DB_URL,
  }),
});

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_MONGODB_URL, { useNewUrlParser: true });

app.engine('ejs', ejsLocals);
app.set('view engine', 'ejs');
app.set('views', 'resources/views');
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(express.json());
app.use(flash());
app.use(session);
app.use('/public', express.static('./public', {}));
app.use((req, res, next) => {
  useHelpers(res);
  next();
});
configRouter(app);

process.on('unhandledRejection', (reason, promise) => {
  console.log(reason);
});

http.listen(process.env.PORT || process.env.APP_PORT, (error) => {
  if (error) {
    throw error;
  }

  console.log(`Host: ${process.env.APP_URL}`);
});
