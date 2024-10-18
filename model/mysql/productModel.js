import sql from "./database.js";

var Product = function (product) {
    this.id = product.id || null;
    this.product_name = product.product_name;
    this.regular_price = product.regular_price;
    this.quantity = product.quantity || 0;
    this.discount_price = product.discount_price || 0;
    this.description = product.description;
    this.is_published = product.is_published || 1;
    this.is_deleted = product.is_deleted || 0;
    this.created_at = product.created_at || new Date();
    this.created_by = product.created_by || 1;
    this.updated_at = product.updated_at == null ? null : new Date();
    this.updated_by = product.updated_by;
};
Product.createProduct = function createProduct(product) {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO products SET ?", product, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res.insertId);
            }
        });
    });
};

Product.updateProduct = function updateProduct(id, product) {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE products SET product_name = ?, regular_price = ?, quantity = ?, discount_price = ?, description = ?, is_published = ?, updated_at = ?, updated_by = ? WHERE id = ?", [product.product_name, product.regular_price, product.quantity, product.discount_price, product.description, product.is_published, product.updated_at, product.updated_by, id], function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            }
            if (res.affectedRows == 0) {
                reject({ kind: "not_found" });
            }
            resolve({ message: "Product updated successfully!" });
        });
    });
};

Product.deleteProduct = function deleteProduct(id) {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE products SET is_deleted = 1 WHERE id = ?", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            }
            if (res.affectedRows == 0) {
                reject({ kind: "not_found" });
            }
            resolve({ message: "Product deleted successfully!" });
        });
    });
};

Product.getProducts = function getProducts() {
    return new Promise((resolve, reject) => {
        sql.query("SELECT product_id AS id, product_name, regular_price, quantity, image_path, is_deleted FROM products p, galleries g WHERE p.id = g.product_id AND g.thumbnail = 1 ", function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

Product.getProduct = function getProduct(id) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT product_id AS id, product_name, regular_price, image_path FROM products p, galleries g WHERE p.id = g.product_id AND g.thumbnail = 1 AND p.id = ?", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

Product.getProductById = function getProductById(id) {
    return new Promise((resolve, reject) => {
        sql.query("SElECT id, product_name, regular_price, discount_price, quantity, description, is_published FROM products WHERE id = ?", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

Product.updateQuantity = function updateQuantity(id, quantity) {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE products SET quantity = ? WHERE id = ?", [quantity, id], function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

Product.searchProducts = function searchProducts(query, params) {
    return new Promise((resolve, reject) => {
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

Product.getProductByAttributeIdList = function getProductByAttributeIdList(idList) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT p.id, product_name, regular_price, image_path FROM products p, galleries g, product_attributes a WHERE p.id = g.product_id AND a.product_id = p.id AND g.thumbnail = 1 AND a.attribute_id IN (?)", [idList], function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}
Product.getProductByIDlist = function getProduct(idList) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT product_id AS id, product_name, regular_price, image_path FROM products p, galleries g WHERE p.id = g.product_id AND g.thumbnail = 1 AND p.id IN (?)", [idList], function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

export default Product;
