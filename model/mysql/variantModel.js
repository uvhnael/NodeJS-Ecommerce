import sql from "./database.js";

var Variant = function (variant) {
    this.id = variant.id;
    this.variant_attribute_value_id = variant.variant_attribute_value_id;
    this.product_id = variant.product_id;
    this.price = variant.price;
    this.quantity = variant.quantity;
};

Variant.addVariant = function addVariant(productId, price, quantity) {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO variants SET product_id = ?, price = ?, quantity = ?", [productId, price, quantity], function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res.insertId);
            }
        });
    });
};

Variant.updateVariant = function updateVariant(id, price, quantity) {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE variants SET price = ?, quantity = ? WHERE id = ?", [price, quantity, id], function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            }
            if (res.affectedRows == 0) {
                reject({ kind: "not_found" });
            }
            resolve({ message: "Variant updated successfully!" });
        });
    });
}

Variant.addVariantAttributeValue = function addVariantValue(variant_id, attribute_value_id) {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO variant_attribute_values SET variant_id = ?, attribute_value_id = ?", [variant_id, attribute_value_id], function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

Variant.getByVariantID = function getByVariantID(id) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT id, product_id, quantity, price FROM variants WHERE id = ?", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};


Variant.getByPID = function getByPID(id) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT id, price, quantity FROM variants WHERE product_id = ?", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

export default Variant;
