import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    to: {
        type: String,
        default: 'all'
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    image_url: {
        type: String,
        required: false
    },
    type: {
        type: String,
        enum: ['ORDER_UPDATE', 'PRODUCT_SALE', 'GENERAL', 'OTHER'],
        required: true
    },
    order_details: {
        order_id: {
            type: String,
            required: function () { return this.type === 'order_update'; }
        },
        status: {
            type: String,
            required: function () { return this.type === 'order_update'; }
        }
    },
    product_details: {
        product_id: {
            type: String,
            required: function () { return this.type === 'product_sale'; }
        },
        sale_price: {
            type: Number,
            required: function () { return this.type === 'product_sale'; }
        },
        original_price: {
            type: Number,
            required: function () { return this.type === 'product_sale'; }
        }
    },
    created_at: {
        type: Date,
        default: Date.now,
        index: { expires: '30d' } // TTL index for auto-deletion after 30 days
    },
    received_at: {
        type: Date,
        required: false,
    }
});

export default mongoose.model('Notification', notificationSchema);
