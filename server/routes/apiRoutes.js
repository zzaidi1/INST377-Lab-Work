/* eslint-disable no-console */
import express from 'express';
import fetch from 'node-fetch'; // We use node-fetch because it mimics a browser fetch request

import foodServiceRoutes from './foodServiceRoutes.js';
import sqlDemoRoutes from './sqlDemoRoutes.js'; // this is included in case you want to use a database of your own for the group project

const router = express.Router();

// localhost:3000/api by default, or your personal Heroku server otherwise
router.get('/', (req, res) => {
  // this is known as a "controller" - the code that replies to your route request
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
