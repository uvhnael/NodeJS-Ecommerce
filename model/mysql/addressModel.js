import sql from './database.js';


var Address = function (address) {
    this.id = address.id;
    this.customer_id = address.customer_id;
    this.is_default = address.is_default;
    this.address_line1 = address.address_line1;
    this.address_line2 = address.address_line2;
    this.phone_number = address.phone_number;
    this.city = address.city;
    this.district = address.district;
    this.ward = address.ward;
};



Address.addAddress = function addAddress(address) {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO customers_addresses SET ?", address, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

Address.getAddress = function getAddress(id) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM customers_addresses WHERE customer_id = ? ORDER BY is_default DESC;", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

Address.updateAddress = function updateAddress(address) {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE customers_addresses SET ? WHERE id = ?", [address, address.id], function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

Address.deleteAddress = function deleteAddress(id) {
    return new Promise((resolve, reject) => {
        sql.query("DELETE FROM customers_addresses WHERE id = ?", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

Address.getDefaultAddress = function getDefaultAddress(id) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM customers_addresses WHERE customer_id = ? AND is_default = 1", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

Address.updateDefaultAddress = function updateDefaultAddress(address) {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE customers_addresses SET is_default = 0 WHERE customer_id = ?", address.customer_id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                sql.query("UPDATE customers_addresses SET ? WHERE id = ?", [address, address.id], function (err, res) {
                    if (err) {
                        console.log("Error: ", err);
                        reject(err);
                    } else {
                        resolve(res);
                    }
                });
            }
        });
    });
}

Address.fetchCity = function fetchCity() {
    return new Promise((resolve, reject) => {
        sql.query("SELECT code, full_name FROM provinces", function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

Address.fetchDistrict = function fetchDistrict(code) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT code, full_name FROM districts WHERE province_code = ?", code, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

Address.fetchWard = function fetchWard(code) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT code, full_name FROM wards WHERE district_code = ?", code, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

export default Address;