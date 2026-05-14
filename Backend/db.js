import mongoose from "mongoose";

const connectdb = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
        console.log("mongodb connected successfully!!!", connectionInstance.connection.host);

    } catch (error) {
        console.log(" MongoDB connection error:", error.message);
    }
};

export default connectdb;