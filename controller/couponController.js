import Coupon from "../model/mysql/couponModel.js";

export const fetchProductCoupon = async (req, res) => {
    try {
        const { idList } = req.body;
        const coupon = [];
        for (let id of idList) {
            const productCoupon = await Coupon.fetchProductCoupon(id);
            if (productCoupon.length > 0) {
                coupon.push(productCoupon);
            }
            else {
                coupon.push([]);
            }
        }

        res.status(200).json(coupon);

    } catch (error) {
        console.error("Error during getting product coupon:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}

export const fetchOrderCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.fetchOrderCoupon();
        res.status(200).json(coupon);

    } catch (error) {
        console.error("Error during getting order coupon:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}