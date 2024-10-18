import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    DEVICE_REGISTRATION_TOKEN: {
        type: String,
        required: true
    },
});

export default mongoose.model("tokens", tokenSchema);