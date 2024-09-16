import express from 'express';
import { h2hStatistics } from '../api.js';
import sqlite3 from 'sqlite3';
// const team1league1 = [2023, 33, 39];
// const team2league2 = [2023, 577, 310];

let router = express.Router();

router.get('/:id', (req, res, next) => {
  let db = new sqlite3.Database('footbalData.db', sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
      return next({ status: 500, message: 'nu s-a putut conecta la db' });
    } else {
      console.log('Connected to database');
    }
    db.serialize(() => {
      db.all(
        'SELECT api_footbal_id AS apiFootbalId, name, type, countryname FROM Leagues WHERE countryname = (SELECT name FROM Countries where id = $id)',
        {
          $id: req.params.id
        },
        (err, rows) => {
          if (err) {
            return next({ status: 500, message: 'ceva nu a mers bine' });
          }
          res.status(200).json({
            searchcriteria: 'leagues',
            returndata: rows
          });
        }
      );
    });
    db.close((err) => {
      if (err) {
        console.log(err.message);
      }
      console.log('Close the database connection.');
    });
  });
});

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
          $name: `%${payload}%`
        },
        (err, rows) => {
          if (err) {
            return next({ status: 500, message: 'ceva nu a mers bine' });
          }
          res.status(200).json({
            searchcriteria: 'teams',
            returndata: rows
          });
        }
      );
    });
    db.close((err) => {
      if (err) {
        console.log(err.message);
      }
      console.log('Close the database connection.');
    });
  });

  router.post('/h2hdetails', async (req, res, next) => {
    // console.log(req.body);
    // res.status(200).json({ msg: 'ok', data: req.body });
    try {
      const matches = await h2hStatistics(
        'teams/statistics',
        [req.body.season, req.body.team1, req.body.league1],
        [req.body.season, req.body.team2, req.body.league2]
      );
      res.status(200).json(matches);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: err });
    }
  });
});

export { router };
