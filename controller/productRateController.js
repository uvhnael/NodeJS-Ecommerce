import ProductRate from "../model/mongo/productRateModel.js";
import multer from "multer";

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Directory where uploaded files will be saved
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '_' + file.originalname); // Unique filename
    }
});

const upload = multer({
    storage: multerStorage,
});

export const addRate = async (req, res) => {
    try {
        upload.fields([{ name: 'images', maxCount: 5 }, { name: 'video', maxCount: 1 }])(req, res, async (err) => {
            if (err) {
                console.error("Error uploading files:", err);
                return res.status(500).json({ error: "Error uploading files" });
            }

            console.log(req.body);

            const { customer_id, customer_name, product_id, product_attribute_value, order_item_id, rate, review } = req.body;
            const images = req.files['images'];
            const video = req.files['video'][0]; // Assuming only one video is uploaded

            const imagePaths = images.map(image => image.path);

            // Create a new product rate instance
            const newProductRate = new ProductRate({
                product_id: product_id,
                customer_name: customer_name,
                customer_id: customer_id,
                product_attribute_value: product_attribute_value,
                order_item_id: order_item_id,
                rate: rate,
                review: review,
                image_path: imagePaths,
                video_path: video.path
            });

            // Save the product rate to the database
            await newProductRate.save();

            console.log(newProductRate);

            res.status(200).json({ message: "Rate added successfully" });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}

export const getRate = async (req, res) => {
    try {
        const product_id = req.params.product_id;
        const result = await ProductRate.find({ product_id: product_id }).sort({ created_at: -1 });
        res.status(200).json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}

export const getRateByCustomer = async (req, res) => {
    try {
        const customer_id = req.params.customer_id;
        const result = await ProductRate.find({ customer_id: customer_id }).sort({ created_at: -1 });;
        res.status(200).json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}

export const getOrderItemIdByCustomer = async (req, res) => {
    try {
        const customerId = req.params.customer_id;
        if (!customerId || isNaN(customerId)) {
            return res.status(400).json({ error: 'Invalid customer ID' });
        }

        const customer_id = Number(customerId);
        const result = await ProductRate.find({ customer_id: customer_id }).select('order_item_id');
        // Extract product_id from the result
        const ProductIdList = result.map(rate => rate.order_item_id);
        res.status(200).json(ProductIdList);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}

