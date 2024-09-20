import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connect = async () => {
          try {
                    // Ensure MONGO_URI is defined and correct
               
                    // Connect to MongoDB
                    await mongoose.connect(process.env.MONGO_URI);
                    console.log('Connected to MongoDB');
          } catch (error) {
                    console.error("Couldn't connect to MongoDB", error);
          }
};

export default connect;
