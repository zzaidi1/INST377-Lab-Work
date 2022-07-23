/* eslint-disable no-console */
import express from 'express';

import foodServiceRoutes from './foodServiceRoutes.js';
import sqlDemoRoutes from './sqlDemoRoutes.js'; // this is included in case you want to use a database of your own for the group project

const router = express.Router();

/* eslint-disable max-len */
/*
  ## What is this file?
  This is the main "router" for the server-side of your application.
  It listens for address requests - like 'http://your-app.heroku.com/api' - and sends a response.
  The response can be anything.

  In this file we have three demonstrations, an HTML page, a basic external API request, and a SQL request.

  For a long time, when we did a "get" request - asked for an address - JUST an HTML page would come back.
  Now, though, most clients are built of Javascript, which changes our route structure a lot.

  In this class, we separate our data routes and our content routes.

  Content is available at 'http://your-app.heroku.com/'
  Data is available at 'http://your-app.heroku.com/api' - you can find this command at line

*/
/* eslint-enable max-len */

// localhost:3000/api by default, or your personal Heroku server otherwise

router.get('/', (req, res) => {
  /*
   */
  console.log('You touched the default route!');
  res.json({ message: 'Welcome to the UMD Dining API!' });
});

/* How To Include A Sub-Route */

// these routes have their actual methods and controllers stored elsewhere
// When we use these routes, we don't repeat ourselves, which reduces the risk of breakage
router.use('/foodServicesPG', foodServiceRoutes);

// this sub-route uses a database you control,
// rather than one controlled by a third party
router.use('/sqlDemo', sqlDemoRoutes);

export default router;
