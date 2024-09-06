import express from 'express';
import { router as h2hRouter } from './routes/h2h.js';
import { router as statusRouter } from './routes/status.js';

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.use('/h2h', h2hRouter);
app.use('/status', statusRouter);

app.get('/', (req, res, next) => {
  res.render('index.html');
});

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
