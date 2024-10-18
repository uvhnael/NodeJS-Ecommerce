import sql from "./database.js";

var Order = function (order) {
    this.id = order.id;
    this.price = order.price;
    this.coupon_id = order.coupon_id;
    this.customer_id = order.customer_id;
    this.customer_address_id = order.customer_address_id;
    this.order_status_id = order.order_status_id;
    this.order_approved_at = order.order_approved_at;
    this.order_delivered_carrier_date = order.order_delivered_carrier_date || null;
    this.order_delivered_customer_date = order.order_delivered_customer_date || null;
    this.created_at = order.created_at || new Date();
};

Order.create = function create(newOrder) {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO orders SET ?", newOrder, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res.insertId);
            }
        });
    });
};

Order.update = function update(id, status_id) {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE orders SET order_status_id = ? WHERE id = ?", [status_id, id], function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

Order.getInsertId = function getInsertId() {
    return new Promise((resolve, reject) => {
        sql.query("SELECT LAST_INSERT_ID()", function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

Order.getOrderByCID = function getOrderByCID(id) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM orders WHERE customer_id = ? ORDER BY id DESC", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

Order.getOrderByCIDAndStatus = function getOrderByCIDAndStatus(id, status) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT id FROM orders WHERE customer_id = ? AND order_status_id = ? ORDER BY id DESC", [id, status], function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

export default Order;
