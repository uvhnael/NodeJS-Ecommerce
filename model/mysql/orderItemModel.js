import sql from "./database.js";

var OrderItem = function (orderItem) {
    this.id = orderItem.id;
    this.order_id = orderItem.order_id;
    this.product_id = orderItem.product_id;
    this.variant_id = orderItem.variant_id;
    this.price = orderItem.price;
    this.quantity = orderItem.quantity;
};

OrderItem.create = function create(newOrderItem) {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO order_items SET ?", newOrderItem, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

OrderItem.getByOID = function getByOID(order_id) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM order_items WHERE order_id = ?", order_id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

export default OrderItem;
