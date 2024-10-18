import sql from "./database.js";

var Coupon = function (coupon) {
    this.id = coupon.id;
    this.code = coupon.code;
    this.discount = coupon.discount;
    this.start_date = coupon.start_date;
    this.end_date = coupon.end_date;
}

Coupon.fetchProductCoupon = function fetchProductCoupon(id) {
    return new Promise((resolve, reject) => {
        sql.query("SELECT id, code, coupon_description, discount_type, discount_value, max_usage, times_used  FROM coupons WHERE id IN(SELECT coupon_id FROM product_coupons WHERE product_id = ?) AND times_used < max_usage AND coupon_start_date < NOW() AND coupon_end_date > NOW()", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}
Coupon.fetchOrderCoupon = function fetchOrderCoupon() {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM coupons WHERE (discount_type = 'fixed' OR discount_type = 'percentage') AND times_used < max_usage AND coupon_start_date < NOW() AND coupon_end_date > NOW()", function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

Coupon.updateCoupon = function updateCoupon(id) {
    return new Promise((resolve, reject) => {
        sql.query("UPDATE coupons SET times_used = times_used + 1 WHERE id = ?", id, function (err, res) {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(res);
            }
        });
    });
}

export default Coupon;