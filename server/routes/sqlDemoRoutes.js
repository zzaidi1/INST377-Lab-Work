import express from 'express';
import sequelize from 'sequelize';
import chalk from 'chalk';
import fetch from 'node-fetch';

import db from '../database/initializeDB.js';
// import hallIdQuery from '../controllers/diningHall.js';
import mealsQuery from '../controllers/meals_query.js';

const router = express.Router();

// /api/sqlDemo
router
  .route('/')
  .get(async (req, res) => {
    try {
      console.log('Touched sqlDemo get');
      const result = await db.sequelizeDB.query(mealsQuery, {
        type: sequelize.QueryTypes.SELECT
      });
      res.json({ data: result });
    } catch (error) {
      console.log('sqlDemo get error', error);
      res.json({ message: 'error in sqlDemo' });
    }
  })
  .post(async (req, res) => {
    // TODO - Table 'Dining_Hall_Tracker.Meals' doesn't exist
    // TODO: we need to demonstrate hooking this to a form
    try {
      console.dir(req.body, {depth: null}); // Checking that we have a body at all!
      console.log(req.body?.category); // Optionally checking for the dining value on body object
      const mealCategory = req.body?.category || 0;
      const result = await db.sequelizeDB.query(mealsQuery, {
        replacements: { meal_category: mealCategory },
        type: sequelize.QueryTypes.SELECT
      });
      res.json({ data: result });
    } catch (err) {
      console.log(err);
      res.send({ message: err});
    }
  });

export default router;
