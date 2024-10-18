import sql from "./database.js";

var Cart = function (cart) {
    this.id = cart.id;
    this.customer_id = cart.customer_id;
    this.product_id = cart.product_id;
    this.quantity = cart.quantity;
    this.variant_id = cart.variant_id;
};

Cart.create = function create(newCart) {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO carts SET ?", newCart, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

Cart.isExist = function isExist(customer_id, product_id, variant_id) {
    return new Promise((resolve, reject) => {
        let query;
        let params;

        if (variant_id === null) {
            query = "SELECT * FROM carts WHERE customer_id = ? AND product_id = ? AND variant_id IS NULL";
            params = [customer_id, product_id];
        } else {
            query = "SELECT * FROM carts WHERE customer_id = ? AND product_id = ? AND variant_id = ?";
            params = [customer_id, product_id, variant_id];
        }

        sql.query(query, params, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};


Cart.update = function update(id, variant_id, quantity) {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE carts SET quantity = ?, variant_id = ? WHERE id = ?", [quantity, variant_id, id], function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

Cart.delete = function (id) {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM carts WHERE id = ?", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};
Cart.deleteByOrderID = function (customer_id, product_id, variant_id) {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM carts WHERE customer_id = ? AND product_id = ? AND variant_id = ?", [customer_id, product_id, variant_id], function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

Cart.getCartByCID = function (id) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM carts WHERE customer_id = ? ORDER BY id DESC", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

Cart.getCartByID = function (id) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM carts WHERE id = ?", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

export default Cart;
