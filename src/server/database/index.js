import mongoose from 'mongoose';
import Product from './product-model';

mongoose.set('useNewUrlParser', true);
mongoose.set('useCreateIndex', true);

const connectDb = () => mongoose.connect(process.env.MONGO_URI);
const dbStatus = () => ({
  state: mongoose.STATES[mongoose.connection.readyState]
});

const models = { Product };

export { connectDb, dbStatus };

export default models;
