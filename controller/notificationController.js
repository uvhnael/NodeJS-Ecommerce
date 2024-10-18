import Token from "../model/mongo/tokenModel.js";
import Notification from "../model/mongo/notificationModel.js";
import { io } from "../index.js";
import admin from "firebase-admin";
import { readFileSync } from 'fs';
const serviceAccount = JSON.parse(readFileSync('./FCMAccountKey.json', 'utf-8'));

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

export const sendWebNotification = (req, res) => {
    const notification = req.body;
    io.emit('receiveNotification', notification);
    res.status(200).send('Notification sent');
};

// Function to handle socket connections
export const handleSocketConnection = (socket) => {
    // console.log('New client connected');

    socket.on('sendNotification', (data) => {
        console.log('Notification received:', data);
        io.emit('receiveNotification', data); // Broadcast to all clients
    });

    // socket.on('disconnect', () => {
    //     console.log('Client disconnected');
    // });
};

export const addCustomerToken = async (req, res) => {
    try {
        const { email, DEVICE_REGISTRATION_TOKEN } = req.body;

        const isTokenExist = await Token.findOne({ email: email });

        if (isTokenExist) {
            isTokenExist.DEVICE_REGISTRATION_TOKEN = DEVICE_REGISTRATION_TOKEN;
            await isTokenExist.save();
            return res.status(200).json({ message: "Token updated successfully" });
        }
        else {

            const token = new Token({
                email: email,
                DEVICE_REGISTRATION_TOKEN: DEVICE_REGISTRATION_TOKEN
            });
            await token.save();
            res.status(200).json({ message: "Token added successfully" });

        }
    } catch (error) {
        console.error("Error during adding token:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}

export const sendNotification = async (req, res) => {

    try {
        const notification = new Notification(req.body);

        let registrationTokens = [];
        if (notification.to === undefined || notification.to === null || notification.to === "" || notification.to === "all") {
            const token = await Token.find();
            registrationTokens = token.map(token => token.DEVICE_REGISTRATION_TOKEN);
        }
        else {
            const token = await Token.find({ email: notification.to });
            registrationTokens = token.map(token => token.DEVICE_REGISTRATION_TOKEN);
        }

        const message = {
            notification: {
                title: notification.title,
                body: notification.body,
                image: notification.image_url
            },
            tokens: registrationTokens
        };

        admin.messaging().sendMulticast(message)
            .then((response) => {
                console.log('Successfully sent message:', response);
                notification.save();
                res.status(200).json({ message: "Notification sent successfully" });
            })
            .catch((error) => {
                console.log('Error sending message:', error);
                res.status(500).json({ error: "Error sending notification" });
            });

    }
    catch (error) {
        console.error("Error during sending notification:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}

export const getNotification = async (req, res) => {
    try {
        const email = req.params.email;
        // to = email or to = all
        const result = await Notification.find({ to: { $in: [email, "all"] } }).sort({ created_at: -1 });

        res.status(200).json(result);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}

export const seen = async (req, res) => {
    try {
        const id = req.params.id;
        const notification = await Notification.findById(id);

        notification.received_at = Date.now();

        await notification.save();
        res.status(200).json(notification);
    }
    catch (error) {
        console.error("Error during seen notification:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}



