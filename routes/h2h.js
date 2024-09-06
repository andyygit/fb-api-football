import express from 'express';
import { h2hStatistics } from '../api.js';

const team1league1 = [2023, 33, 39];
const team2league2 = [2023, 577, 310];

let router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const matches = await h2hStatistics('teams/statistics', team1league1, team2league2);
    res.status(200).json(matches);
  } catch (err) {
    console.log(err);
  }
});

export { router };
