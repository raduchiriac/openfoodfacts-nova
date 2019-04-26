import express from 'express';
import models, { connectDb, dbStatus } from './database';

process.env.NODE_ENV === 'production' && require('babel-polyfill');
require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.static('dist-client'));

const buildQuery = (txt) => {
  const fields = [
    'product_name',
    'categories',
    'pnns_groups_1',
    'pnns_groups_2',
    'main_category',
    'ingredients_text'
  ];
  return {
    $or: fields.map(el => ({ [el]: { $regex: txt, $options: 'i' } }))
  };
};

const handleError = (err) => {
  console.log(err);
};

connectDb().then(async () => {
  // console.log(dbStatus());
  app.post('/api/getProducts', (req, res) => {
    const query = models.Product.find(buildQuery(req.body.product))
      .limit(req.body.limit)
      .skip(req.body.offset)
      .sort({ last_modified_t: -1 });
    query
      .exec()
      .then(docs => res.status(200).send(docs))
      .catch(err => handleError(err));
  });

  app.listen(port, () => {
    console.log(`server listening on port: ${port}`);
  });
});
