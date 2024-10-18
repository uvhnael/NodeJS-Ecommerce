import Customer from "../model/mysql/customerModel.js";
import jwt from "jsonwebtoken";
import OTP from "../model/mongo/otpModel.js";
import axios from "axios";
import e from "express";


export const isJWTValid = async (req, res) => {
  try {

    const token = req.body.token;

    jwt.verify(token, "secret", (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      res.status(200).json({ message: "Token is valid" });
    });
  }
  catch (error) {
    console.error("Error during JWT validation:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};


export const login = async (req, res) => {
  try {

    const customer = new Customer(req.body);

    const result = await Customer.getByEmail(customer.email);

    if (result.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result[0];

    if (user.password !== customer.password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if (user.active === 0) {
      return res.status(403).json({ message: "User not active" });
    }

    const payload = {
      email: user.email,
      id: user.id,
    };
    // 1min expiry time
    const expiresInTime = 60 * 60 * 24; // 1min


    // const expiresInTime = 60 * 60 * 24 * 30; // 1min

    const token = await new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        "secret",
        { expiresIn: expiresInTime },
        (err, token) => {
          if (err) reject(err);
          else resolve(token);
        }
      );
    });

    user.token = token;
    res.status(200).json(user);

  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const googleLogin = async (req, res) => {
  try {
    const customer = new Customer(req.body);

    const result = await Customer.getByEmail(customer.email);

    if (result.length === 0) {
      await Customer.register(customer);
    }

    const customerExists = await Customer.getByEmail(customer.email);

    const user = customerExists[0];
    const payload = {
      email: user.email,
      id: user.id,
    };
    // 1min expiry time
    const expiresInTime = 60 * 60 * 24; // 1min


    // const expiresInTime = 60 * 60 * 24 * 30; // 1min

    const token = await new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        "secret",
        { expiresIn: expiresInTime },
        (err, token) => {
          if (err) reject(err);
          else resolve(token);
        }
      );
    });

    user.token = token;
    res.status(200).json(user);
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const register = async (req, res) => {
  try {

    const customer = new Customer(req.body);

    // Check if the email already exists
    const existingCustomer = await Customer.getByEmail(customer.email);
    if (existingCustomer.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }

    await Customer.register(customer);

    const result = await Customer.getByEmail(customer.email);
    const user = result[0];
    const payload = {
      email: user.email,
      id: user.id,
    };
    const expiresInTime = 60 * 60 * 24; // 1min

    const token = await new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        "secret",
        { expiresIn: expiresInTime },
        (err, token) => {
          if (err) reject(err);
          else resolve(token);
        }
      );
    });

    user.token = token;
    res.status(200).json(user);

  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const updatePassword = async (req, res) => {
  try {

    const customer = new Customer(req.body);

    // Check if the customer exists
    const existingCustomer = await Customer.getByEmail(customer.email);
    if (existingCustomer.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    // Update the customer's password
    await Customer.updatePassword(customer.password, customer.email);
    res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Error during password update:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const updateActive = async (req, res) => {
  try {

    const { email } = req.body;

    // Check if the customer exists
    const existingCustomer = await Customer.getByEmail(email);
    if (existingCustomer.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    // Update the customer's password
    await Customer.updateActive(email);
    res.status(200).json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Error during password update:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};



export const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    // localhost/api/auth.php/sendOTP(email)
    const data = { email: email };

    axios.post('http://192.168.2.46/api/auth.php/sendOTP', data)
      .then(response => {
        // find otp form mongodb, if not found create new otp, if found update the existing otp, time
        OTP.findOne({ email: email })
          .then(otp => {
            if (otp === null) {
              const newOTP = new OTP({
                email: email,
                otp: response.data,
                expiry: new Date(new Date().getTime() + 5 * 60000)
              });
              newOTP.save();
            } else {
              otp.otp = response.data;
              otp.expiry = new Date(new Date().getTime() + 5 * 60000);
              otp.save();
            }
          })
          .catch(error => {
            console.error(error);
          });
      })
      .catch(error => {
        console.error(error);
      });

    res.status(200).json({ message: "OTP sent successfully" });

  } catch (error) {
    console.error("Error during OTP generation:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const otpData = await OTP.findOne({ email: email });
    if (otpData === null) {
      return res.status(404).json({ message: "OTP not found" });
    }

    if (otpData.otp !== otp) {
      return res.status(401).json({ message: "Invalid OTP" });
    }

    if (otpData.expiry < new Date()) {
      return res.status(403).json({ message: "OTP expired" });
    }

    res.status(200).json({ message: "OTP verified successfully" });

  } catch (error) {
    console.error("Error during OTP verification:", error);
    res.status(500).json({ message: "Internal Server error" });
  }
};
