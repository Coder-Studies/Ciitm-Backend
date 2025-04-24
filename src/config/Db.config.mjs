import mongoose from 'mongoose';
import lolcat from 'lolcatjs';
import envConstant from '../constant/env.constant.mjs';

const connectToDatabase = async () => {
  try {
    lolcat.options.seed = Math.round(Math.random() * 1000);
    lolcat.options.colors = true;

    const connectionString = envConstant.MONGO_URI;

    mongoose
      .connect(connectionString)
      .then(() => lolcat.fromString(`Connected to Db!`));
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    lolcat.fromObject(error);
  }
};

export default connectToDatabase;
const db_connect = async () => {
  try {
    await connectToDatabase();
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
};

export { db_connect };
