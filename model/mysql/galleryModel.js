import sql from "./database.js";

var Gallery = function (gallery) {
    this.id = gallery.id;
};

Gallery.delById = function delById(id) {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM galleries WHERE id = ?", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

Gallery.getByPID = function getByProductID(id) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT id, image_path, thumbnail, display_order FROM galleries WHERE product_id = ? ORDER BY thumbnail DESC", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

Gallery.addByPID = function addByPID(id, image_path, thumbnail, display_order) {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO galleries (product_id, image_path, thumbnail, display_order) VALUES (?, ?, ?, ?)", [id, image_path, thumbnail, display_order], function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

export default Gallery;
