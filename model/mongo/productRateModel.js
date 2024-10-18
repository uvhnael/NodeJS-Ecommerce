import mongoose from "mongoose";

const rateSchema = new mongoose.Schema({
    product_id: {
        type: Number,
        required: true
    },
    product_attribute_value: {
        type: String,
        required: true
    },
    customer_id: {
        type: Number,
        required: true
    },
    customer_name: {
        type: String,
        required: true
    },
    order_item_id: {
        type: Number,
        required: true
    },
    rate: {
        type: Number,
        required: true
    },
    review: {
        type: String,
        required: true
    },
    // list link video
    video_path: {
        type: String,
    },
    // list link image
    image_path: {
        type: Array,
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("productRate", rateSchema);