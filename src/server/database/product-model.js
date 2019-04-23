import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  product_name: {
    type: String,
    index: true
  },
  code: {
    type: Number,
    unique: true
  }
});

const Product = mongoose.model('Product', productSchema, 'products');

export default Product;
