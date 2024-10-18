import Order from "../model/mysql/orderModel.js";
import OrderItem from "../model/mysql/orderItemModel.js";
import Cart from "../model/mysql/cartModel.js";
import Product from "../model/mysql/productModel.js";
import Variant from "../model/mysql/variantModel.js";
import Coupon from "../model/mysql/couponModel.js";
import Attribute from "../model/mysql/attributeModel.js";
import moment from 'moment';

export const create = async (req, res) => {
    try {

        const { customer_id } = req.body;
        const order = new Order(req.body);


        // Create the order 
        const orderId = await Order.create(order);
        await Coupon.updateCoupon(order.coupon_id);

        // Iterate through order items to perform necessary actions
        const orderItems = req.body.order_items;

        for (const orderItemData of orderItems) {
            const orderItem = new OrderItem(orderItemData);
            orderItem.order_id = orderId;

            // Create order item
            await OrderItem.create(orderItem);

            // Delete item from cart
            const existsCartItem = await Cart.isExist(customer_id, orderItem.product_id, orderItem.variant_id);
            if (existsCartItem.length > 0) {
                await Cart.delete(existsCartItem[0].id);
            }
            // Update variant quantity
            if (orderItem.variant_id !== null) {
                const variant_res = await Variant.getByVariantID(orderItem.variant_id);
                const variant = variant_res[0];
                variant.quantity -= orderItem.quantity;
                await Variant.updateVariant(orderItem.variant_id, variant.price, variant.quantity);
            }

            // Update product quantity
            const product_res = await Product.getProductById(orderItem.product_id);
            const product = product_res[0];
            product.quantity -= orderItem.quantity;
            await Product.updateQuantity(product.id, product.quantity);

            // Update coupon usage
            const couponId = orderItemData.coupon_id;
            await Coupon.updateCoupon(couponId);
        }

        res.status(201).json({ message: "Order created successfully" });
    } catch (error) {
        console.error("Error during order creation:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
};

export const update = async (req, res) => {
    try {
        const { id } = req.params;
        const { status_id } = req.body;

        await Order.update(id, status_id);

        res.status(200).json({ message: "Order updated successfully" });
    } catch (error) {
        console.error("Error during order update:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
};

export const getOrderItems = async (req, res) => {
    try {
        const { id } = req.params;
        const orderItems = await OrderItem.getByOID(id);
        res.status(200).json(orderItems);
    } catch (error) {
        console.error("Error retrieving order items:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
};

export const getOrderByCID = async (req, res) => {
    try {
        const { id } = req.params;
        const orders = await Order.getOrderByCID(id);
        const ordersDetail = await Promise.all(orders.map(async (order) => {
            const orderItems = await OrderItem.getByOID(order.id);

            const product = await Promise.all(orderItems.map(async (orderItem) => {
                const product = await Product.getProduct(orderItem.product_id);
                if (orderItem.variant_id !== null) {
                    const attribute_value = await Attribute.getByVariantId(orderItem.variant_id);
                    let attribute_value_str = "";
                    attribute_value_str += attribute_value[0].attribute_value;
                    for (let i = 1; i < attribute_value.length; i++) {
                        attribute_value_str += ", " + attribute_value[i].attribute_value;
                    }
                    orderItem.attribute_value = attribute_value_str;
                }
                orderItem.product = product[0];
                return orderItem;
            }));
            order.order_approved_at = moment(order.order_approved_at).format('HH:mm:ss DD/MM/YY');
            order.order_delivered_carrier_date = moment(order.order_delivered_carrier_date).format('HH:mm:ss DD/MM/YY');
            order.order_delivered_customer_date = moment(order.order_delivered_customer_date).format('HH:mm:ss DD/MM/YY');
            order.created_at = moment(order.created_at).format('HH:mm:ss DD/MM/YY');
            order.order_items = product;
            return order;
        }));
        res.status(200).json(ordersDetail);
    } catch (error) {
        console.error("Error retrieving orders by customer ID:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
};

export const getOrderItemsByCID = async (req, res) => {
    try {
        const { id } = req.params;
        const orderId = await Order.getOrderByCIDAndStatus(id, 3);
        var orderItems = [];

        for (const order of orderId) {
            const orderItem = await OrderItem.getByOID(order.id);
            orderItems = orderItems.concat(orderItem);
        }

        res.status(200).json(orderItems);
    } catch (error) {
        console.error("Error retrieving order items by customer ID:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}
