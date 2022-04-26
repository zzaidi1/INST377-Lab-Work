import express from 'express';
import sequelize from 'sequelize';
import chalk from 'chalk';
import fetch from 'node-fetch';

import db from '../database/initializeDB.js';

const router = express.Router();

// /api/wholeMeal
router.route('/')
  .get(async (req, res) => {
    try {
      const meals = await db.Meals.findAll();
      const macros = await db.Macros.findAll();
      const wholeMeals = meals.map((meal) => {
        const macroEntry = macros.find((macro) => macro.meal_id === meal.meal_id);
        console.log('meal', meal);
        console.log('macroEntry', macroEntry);

        return {
          ...meal.dataValues,
          ...macroEntry.dataValues
        };
      });
      res.json({ data: wholeMeals });
    } catch (err) {
      console.error(err);
      res.json({ message: err});
    }
  });

router
  .route('/2')
  .get(async (req, res) => {
    try {
      const meals = await db.Meals.findAll({ include: db.Macros, limit: 10 });

      const wholeMeals = meals.map((meal) => {
        console.log('meal', meal);
        const dataObject = {
          ...meal.dataValues,
          ...meal.Macro.dataValues
        };

        delete dataObject.Macro;
        return dataObject;
      });

      console.log(wholeMeals);
      res.json({ data: wholeMeals });
    } catch (err) {
      console.error(err);
      res.json({ message: err });
    }
  })
  .post(async (req, res) => {
    try {
      console.log('Received POST on /wholeMeal2', req.body);
      if (!req.body.name) {
        throw new Error('Missing name');
      }
    } catch (err) {
      console.error(err);
      res.json({ message: err });
    }
  });

export default router;
