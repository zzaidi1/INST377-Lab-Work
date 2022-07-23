/* eslint-disable no-console */
// NPM library dependencies
import express from 'express';
import reload from 'livereload';
import dotenv from 'dotenv';
import path from 'path';

// lab-authored routes
import apiRoutes from './server/routes/apiRoutes.js';

// This sets us up to bring in the .env file, which usually stores application secrets
dotenv.config();

// this helps a bit with loading files further down
const __dirname = path.resolve();

// This is commented out because SQL servers are optional in this class
// import db from './server/database/initializeDB.js';

const app = express(); // Turn on our base application
const PORT = process.env.PORT || 3000; // Set our port number to be flexible when deployed
const staticFolder = 'client'; // Our HTML and CSS live in the "staticFolder" - client, public, or build are common names
let liveReloadServer;

// Add some auto-reloading to our server
if (process.env.CONTEXT === 'development') {
  liveReloadServer = reload.createServer();
  liveReloadServer.watch(path.join(__dirname, staticFolder));
}

// We let requests come in to our application from any address, which is unusual now
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// These let us use JSON data structures to communicate
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//  Set our app structure to use 'http://[whatever-you-chose]/ for our main app
//  And 'http://[whatever-you-chose]/api for our data
//  While developing, this will be 'http://localhost:3000' - the number set at line 16 in this file.
//  In public, it will probably be 'http://your-app-name.heroku.com'
app.use(express.static(staticFolder));
app.use('/api', apiRoutes);

// This function declares what happens when our server turns on
async function bootServer() {
  try {
    app.listen(PORT, async () => {
      // Turn these back on in later labs
      // const mysql = await db.sequelizeDB;
      // await mysql.sync();
      console.log(`Listening on: http//localhost:${PORT}`);
      console.log('environment:', process.env.CONTEXT);
    });
  } catch (err) {
    console.error(err);
  }
}

// And here, we turn the server on by calling the function
bootServer();

if (process.env.CONTEXT === 'development') {
  liveReloadServer.server.once('connection', () => {
    setTimeout(() => {
      liveReloadServer.refresh('/');
    }, 100);
  });
}
