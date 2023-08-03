import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './router.js';

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('<h1>Keep Link Server</h1>');
});

app.use('/api', router);

app.listen('5000', () => {
  console.log('Server is running on port 5000');
});
