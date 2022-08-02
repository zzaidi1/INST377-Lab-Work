/* eslint-disable max-len */
/* eslint-disable no-console */
import express from 'express';

/*
  ## What is this file?

  This is a route handling file for our demo data.
  It "imports" other modules - like Express, above, or our own work below.
  Those other files help us process data.

  You should look through them to understand what is happening.
  The first one is a "middleware" that is asynchronous - it loads data from PG County Open Data and passes it through to our data controllers

  The second one will be used in later labs: it's a way of making data controllers more legible by making them smaller
*/

// This import is in brackets because 'loadFoodServiceData' is set as the name in the export
import { loadFoodServiceData } from '../middleware/loadFoodServicesData.js';

// here, basicControllers is a name we made up in this file, which exports an unnamed 'default' object
import foodServiceControllers from '../controllers/foodServiceControllers.js';

// we are using a new instance of the router per-file - apiRoutes also has a router instance in it.
const router = express.Router();

/*
  Here we ask this particular router to "use" the imported "middleware" `loadFoodServiceData`
  to load data _before_ any of our routes load.
  The order of the code is important in this case.
*/
router.use(loadFoodServiceData);

/*
  And here we begin to set up our route methods - GET, POST, PUT and so on
  For Lab 5, you'll only be working with the `.get()` method

  The other methods come in later!
*/

router
  .route('/') // /api/foodServicePG - this address is set in /apiRoutes!
  .get(async (req, res) => { // Setting this callback to use an async keyword gives us access to await even if we don't use it
    /*
      GET is what happens when you load a route with no other requests
      With your server turned on, you can load this route in your browser at localhost:3000/api/foodServicePG
      It might take a moment to load, because we are asking a third party for information
      Then we will structure our information on the server
      And pass what we need to our client
    */
    try { // Try: This code might work! It might not, though. It's important to res - respond, to seal the request - regardless.
      console.log('You touched the foodService Route!');
      console.log('req.foodServiceData', req.foodServiceData.length); // this information comes in through the middleware above
      res.json({ data: req.foodServiceData }); // and here we're closing our route by passing back unfiltered data
    //
    //
    } catch (err) { // Catch: if our above code breaks, this will fire, and send a response to our client saying what happened.
      console.log(err); // Show the server our error

      // Send a reply to make sure our request from our front-end does not hang open
      res.json({
        message: 'Something went wrong in our foodServicePG GET request',
        error: err
      });
    }
  }) // Other controllers live in the basicControllers file, for legibility - you can even separate them by file if they get very complex
  .post((req, res) => foodServiceControllers.handlePostRequest(req, res))
  .put((req, res) => foodServiceControllers.handlePutRequest(req, res))
  .delete((req, res) => foodServiceControllers.handleDeleteRequest(req, res));

/*
  This route is separated out because it is a 'sub-route' of /foodServicePG
  It turns up if you add an optional string after the main URL - which will be interpreted as "category" of restaurant
  http://localhost:3000/api/foodServicePG/fastfood, for example
  URLs like this are convenient because they can be bookmarked in the browser, and still use basic GET methods
*/
router.route('/:category')
  .get(async (req, res) => {
    try {
      console.log('Touched foodServices /:category');
      // + req.params.category
      // TODO: if category does not exist, return

      /*
        The following two lines "destructure" information from an object
        in this case, 'req,' which has both `req.params.category` and `req.foodServiceData`
        req.params.whatever is set in our route - here, /:category
        req.foodServiceData is set in our middleware
        for more on destructuring: https://wesbos.com/destructuring-renaming
      */
      const { foodServiceData: data } = req;
      const {category} = req.params;

      // console.log('data', data); // debug logs to check what we're getting back
      // console.log('category', category);

      // this is a data filter!
      // it will run more quickly on your server than your client
      // because your server has more power to run loops than a small, hot phone
      // This is a small data set, but it is useful for an example
      const filteredData = data.filter(
        (item) => item.category.toLowerCase() === category.toLowerCase()
      );

      // console.log(filteredData);

      // this response "closes" our request to the ID route, and sends back an object with the key of .data set
      res.json({ data: filteredData });
    } catch (err) {
      console.log(err);
      res.json({ message: 'Something went wrong', error: err });
    }
  }).post((req, res) => {
    try {
      console.log('Touched post request on /:category');
      /*
        we have no information here until we accept and process the request,
        but we need to close the request loop anyway.
        So we send an empty array.
       */
      res.json({data: []});
    } catch (err) {
      console.log(err);
      res.json({ message: 'Something went wrong', error: err });
    }
  });

export default router;
