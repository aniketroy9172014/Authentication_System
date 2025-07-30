import mongoose from 'mongoose';

//connect to mongodb
const connectDB = async () => {
    await mongoose.connect(process.env.URI)
    .then(()=> console.log("Mongo db connected"))
    .catch((err)=> console.log("ERROR: ", err));
  };

// this exporting the function for use in other code
export default connectDB;
