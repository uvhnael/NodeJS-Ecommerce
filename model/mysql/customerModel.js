import sql from "./database.js";

var Customer = function (customer) {
    this.id = customer.id;
    this.name = customer.name;
    this.phone_number = customer.phone_number || "";
    this.email = customer.email;
    this.password = customer.password;
    this.active = customer.active || 0;
    this.registered_at = customer.registered_at || new Date();
    this.created_at = customer.created_at || new Date();
};

Customer.register = function create(newCustomer) {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO customers SET ?", newCustomer, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

Customer.getByEmail = function getByEmail(email) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT id, name, phone_number, email, password, active FROM customers WHERE email = ?", email, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

Customer.updatePassword = function updatePassword(password, email) {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE customers SET password = ? WHERE email = ?", [password, email], function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

Customer.updateActive = function updateActive(email) {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE customers SET active = 1 WHERE email = ?", [email], function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}


Customer.getCustomerById = function getCustomerById(id) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT id, name, phone_number, email, active, registered_at FROM customers WHERE id = ?", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

Customer.updateCustomer = function updateCustomer(customer, id) {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE customers SET ? WHERE id = ?", [customer, id], function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}
export default Customer;
