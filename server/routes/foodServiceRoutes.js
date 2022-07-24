/* eslint-disable max-len */
/* eslint-disable no-console */
import express from 'express';

// this import is in brackets because 'loadFoodServiceData' is set as the name in the export
import { loadFoodServiceData } from '../middleware/loadFoodServicesData.js';

// here, basicControllers is a name we made up in this file, which exports an unnamed 'default' object
import foodServiceControllers from '../controllers/foodServiceControllers.js';

const router = express.Router(); // we are using a new instance of the router per-file

/*
  ## What is this file?
  This file contains the main API for class exercises, the Prince George's County Food Safety Data Set.
*/

/*
  Here we ask this particular router to use the imported "middleware" to load data
  _before_ any of our routes load. The order of the code is important in this case.
*/
router.use(loadFoodServiceData);

/* And here we begin to set up our route methods - GET, POST, PUT and so on */
router
  .route('/') // /api/foodServicePG
  .get(async (req, res) => { // This is your first demo controller!
    /*
      GET is what happens when you load a route with no other requests
      With your server turned on, you can load this route in your browser at localhost:3000/api/foodServicePG
      It might take a moment to load, because we are asking a third party for information
      Then we will structure our information on the server
      And pass what we need to our client
    */
    try {
      console.log('You touched the foodService Route!');
      console.log('req.foodServiceData', req.foodServiceData); // this information comes in through the middleware above
      res.json({ data: req.foodServiceData }); // and here we're closing our route by passing back unfiltered data
    } catch (err) {
      // again, these error functions act as a safety to make sure your requests don't hang
      console.log(err);
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
  This route is separated out because it is a sub-route of /foodServicePG
  It turns up if you add an optional string after the main URL - which will be interpreted as "category" of restaurant
  http://localhost:3000/api/foodServicePG/fastfood, for example
  URLs like this are convenient because they can be bookmarked in the browser
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
      // because your server has more power to run loops than a small, hot cellphone
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
