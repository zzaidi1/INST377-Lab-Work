/* eslint-disable max-len */
/* eslint-disable no-console */
import express from 'express';
import fetch from 'node-fetch';

const router = express.Router(); // we are using a new instance of the router per-file

/*
  ## What is this file?
  This file contains the main API for class exercises, the Prince George's County Food Safety Data Set.
  It also contains an example of "middleware," which is how we separate out our data request.
*/

/*
  This function loads data from our third party API
  It has been separated out so it will not be repeated in our "controllers"
*/
async function loadFoodServiceData(req, res, next) {
  try {
    const url = 'https://data.princegeorgescountymd.gov/resource/umjn-t2iz.json'; // remote URL! you can test it in your browser
    const data = await fetch(url); // We're using a library that mimics a browser 'fetch' for simplicity
    const json = await data.json(); // the data isn't json until we access it using dot notation
    console.log(json); // let's check that something's there before we return it
    req.foodServiceData = json; // and let's _attach_ the data to our request object here
    next();
  } catch (err) {
    // and let's handle any errors by closing the request with a message
    console.log('Data request failed', err);
    res.json({ message: 'Data request failed', error: err });
  }
}

/*
  Here we ask this particular router to use the above "middleware" to load data
  _before_ any of our routes load. The order of the code is important in this case.
*/
router.use(loadFoodServiceData);

router
  .route('/') // /api/foodServicePG
  .get(async (req, res) => {
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
  })
  .post((req, res) => {
    try {
      console.log('Touched post endpoint', req.body);
      console.log(req.body?.resto);
      res.json({ message: 'post FoodServices endpoint' });
    } catch (err) {
      console.log(error);
      res.json({ error: 'Something went wrong on the server' });
    }
  })
  .put((req, res) => {
    try {
      res.json({ message: 'put FoodServices endpoint' });
    } catch (err) {
      console.log(error);
      res.json({ error: 'Something went wrong on the server' });
    }
  })
  .delete((req, res) => {
    try {
      res.json({ message: 'delete FoodServices endpoint' });
    } catch (err) {
      console.log(error);
      res.json({ error: 'Something went wrong on the server' });
    }
  });

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
