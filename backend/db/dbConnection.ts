import mongoose from "mongoose";
const mongoDbUrl = process.env.MONGODB_URL;

const connection = async() => {
    const connectionState = mongoose.connection.readyState;

    if(connectionState === 1){
        console.log("Already connected");
        return;
    }
    if(connectionState === 2){
        console.log("Connecting..");
        return;
    }

    try {
        mongoose.connect(mongoDbUrl!,{
            dbName:'events',
            bufferCommands: true
        })
    } catch (error) {
        console.log("Error",error);
        if(error instanceof Error){
            throw new Error("Error during connecting to db",error)
        }
    }
}

export default connection;