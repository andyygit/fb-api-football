import express from 'express';
import { h2hStatistics } from '../api.js';
import sqlite3 from 'sqlite3';
// const team1league1 = [2023, 33, 39];
// const team2league2 = [2023, 577, 310];

let router = express.Router();

router.post('/', async (req, res, next) => {
  // console.log(req.body);
  // res.status(200).json(req.body.team);

  let payload = req.body.team;
  let db = new sqlite3.Database('footbalData.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return next({ status: 500, message: 'nu s-a putut conecta la db' });
    } else {
      console.log('Connected to database');
    }
    db.serialize(() => {
      db.all(
        'SELECT id, api_footbal_id AS apiFootbalId, name, country_id AS countryId FROM Teams WHERE name LIKE $name',
        {
          $name: `%${payload}%`,
        },
        (err, rows) => {
          if (err) {
            return next({ status: 500, message: 'ceva nu a mers bine' });
          }
          res.status(200).json(rows);
        }
      );
    });
  });

  // try {
  //   const matches = await h2hStatistics('teams/statistics', team1league1, team2league2);
  //   res.status(200).json(matches);
  // } catch (err) {
  //   console.log(err);
  // }
});

export { router };
