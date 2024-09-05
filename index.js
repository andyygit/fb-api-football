import express from 'express';
import { router as homeRouter } from './routes/default.js';

const app = express();

app.use(express.json());

app.use('/', homeRouter);

//redirects
app.all('*', (req, res) => {
  res.status(404).send('<h3>404 Not found!</h3>');
});

//errors
app.use((err, req, res, next) => {
  res.status(err.status).json(err);
  console.error(err.message);
});

app.listen(3000, () => {
  console.log('listening on port 3000');
});
