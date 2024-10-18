import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server as SocketIOServer } from "socket.io";

import productRoute from "./routes/productRoute.js";
import authRoute from "./routes/authRoute.js";
import orderRoute from "./routes/orderRoute.js";
import cartRoute from "./routes/cartRoute.js";
import customerRoute from "./routes/customerRoute.js";
import addressRoute from "./routes/addressRoute.js";
import couponRoute from "./routes/couponRoute.js";
import productRateRoute from "./routes/productRateRoute.js";
import notificationRoute from "./routes/notificationRoute.js";
import categoryRoute from "./routes/categoryRoute.js";
import galleryRoute from "./routes/galleryRoute.js";

import { handleSocketConnection } from "./controller/notificationController.js";

dotenv.config();

const app = express();
const server = http.createServer(app);
export const io = new SocketIOServer(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Middleware to log requests
function logRequest(req, res, next) {
    if (req.url.includes("uploads")) {
        return next();
    }
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} - IP: ${req.ip}`);
    next();
}

app.use(logRequest);
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

// Socket.IO connection handler
io.on('connection', handleSocketConnection);

app.get('/', (req, res) => {
    res.send('Server is running');
});

const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGO_URL;

mongoose.connect(MONGOURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.log("Error connecting to MongoDB", err);
    });

// Use routes
app.use("/api/product", productRoute);
app.use("/api/auth", authRoute);
app.use("/api/order", orderRoute);
app.use("/api/cart", cartRoute);
app.use("/api/customer", customerRoute);
app.use("/api/address", addressRoute);
app.use("/api/coupon", couponRoute);
app.use("/api/product/rate", productRateRoute);
app.use("/api/notification", notificationRoute);
app.use("/api/category", categoryRoute);
app.use("/api/gallery", galleryRoute);

app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
