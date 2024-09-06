import express from 'express';
import { getData } from '../api.js';

let router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const status = await getData('status');
    res.status(200).json(status);
  } catch (err) {
    console.log(err);
  }
});

export { router };
