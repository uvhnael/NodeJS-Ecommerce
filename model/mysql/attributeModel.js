import sql from "./database.js";

var Attribute = function (attribute) {
    this.id = attribute.id;
};

Attribute.addAttributes = function addAttributes(attribute_name) {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO attributes SET attribute_name = ?", attribute_name, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            }
            else {
                resolve(res.insertId);
            }
        });
    });
};

Attribute.addAttributesValue = function addAttributesValue(attribute_id, attribute_value) {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO attribute_values SET attribute_id = ?, attribute_value = ?", [attribute_id, attribute_value], function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res.insertId);
            }
        });
    });
};

Attribute.addByPID = function addByPID(pid, aid) {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO product_attributes SET product_id = ?, attribute_id = ?", [pid, aid], function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

Attribute.getByPID = function getAttributes(id) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT attribute_name, attribute_value FROM attributes a, attribute_values av WHERE a.id = av.attribute_id AND a.id IN (SELECT attribute_id FROM product_attributes WHERE product_id = ?)", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

Attribute.getAttributesByPID = function getAttributes(id) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT id, attribute_name FROM attributes WHERE id IN (SELECT attribute_id FROM product_attributes WHERE product_id = ?)", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

Attribute.getAttributeValues = function getAttributeValues(id) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT id, attribute_value FROM attribute_values WHERE attribute_id = ?", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

Attribute.getByVariantId = function getByVariantId(id) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT attribute_value FROM `attribute_values` WHERE id IN (SELECT attribute_value_id FROM variant_attribute_values WHERE variant_id = ?)", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
};

Attribute.getProductByAttributeSearch = function getAttributes(query, params) {
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

export default Attribute;
