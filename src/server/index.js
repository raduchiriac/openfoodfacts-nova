import express from 'express';

require('dotenv').config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.static('dist'));

const buildProjection = (txt) => {
  const fields = [
    'product_name',
    'categories',
    'pnns_groups_1',
    'pnns_groups_2',
    'main_category',
    'ingredients_text'
  ];
  return {
    $or: fields.map(el => ({ [el]: txt }))
  };
};

app.post('/api/getProducts', (req, res) => {
  console.log(buildProjection(req.body.product));
  return res.status(200);
});

app.listen(port, () => {
  console.log(`server listening on port: ${port}`);
});
