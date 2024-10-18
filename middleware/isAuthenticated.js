import jwt from "jsonwebtoken";

export default async function isAuthenticated(req, res, next) {
    const token = req.headers["authorization"];

    jwt.verify(token, "secret", (err, user) => {
        if (err) {
            console.log(err);
            return res.json({ error: err.message });
        } else {
            req.user = user;
            next();
        }
    });

};