import sql from "./database.js";

var Category = function (category) {
    this.id = category.id;

};

Category.addByPID = function addByPID(product_id, category_id) {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)", [product_id, category_id], function
            (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

Category.getByPID = function getByPID(id) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT id, category_name FROM categories c, product_categories pc WHERE c.id = pc.category_id AND pc.product_id = ?", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

Category.getProductByCategory = function getCategories(query, params) {
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

Category.getAll = function getAllCategories() {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM categories", function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

export default Category;