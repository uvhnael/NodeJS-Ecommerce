import Cart from "../model/mysql/cartModel.js";
import Attribute from "../model/mysql/attributeModel.js";
import Product from "../model/mysql/productModel.js";
import Variant from "../model/mysql/variantModel.js";
import Gallery from "../model/mysql/galleryModel.js";


export const create = async (req, res) => {
    try {
        console.log(req.body);
        const cart = new Cart(req.body);
        console.log(cart);
        const result = await Cart.isExist(cart.customer_id, cart.product_id, cart.variant_id);

        if (result.length > 0) {
            cart.quantity += result[0].quantity;
            cart.id = result[0].id;
            await Cart.update(cart.id, cart.variant_id, cart.quantity);
            return res.status(200).json({ message: "Cart updated successfully" });
        } else {
            await Cart.create(cart);
            return res.status(201).json({ message: "Cart created successfully" });
        }
    } catch (error) {
        console.error("Error during cart creation:", error);
        return res.status(500).json({ error: "Internal Server error" });
    }
};

export const update = async (req, res) => {
    try {

        console.log(req.body);
        const cart = new Cart(req.body);

        const existsCartItem = await Cart.isExist(cart.customer_id, cart.product_id, cart.variant_id);

        if (existsCartItem.length > 0 && existsCartItem[0].id !== cart.id) {
            const existingItem = existsCartItem[0];
            await Cart.delete(existingItem.id);
            await Cart.update(cart.id, cart.variant_id, existingItem.quantity + cart.quantity);
        } else {
            await Cart.update(cart.id, cart.variant_id, cart.quantity);
        }

        return res.status(200).json({ message: "Cart updated successfully" });
    } catch (error) {
        console.error("Error during cart update:", error);
        return res.status(500).json({ error: "Internal Server error" });
    }
};


export const deleteCartItem = async (req, res) => {
    try {
        const id = req.params.id;
        await Cart.delete(id);
        return res.status(200).json({ message: "Cart item deleted successfully" });
    } catch (error) {
        console.error("Error during cart item deletion:", error);
        return res.status(500).json({ error: "Internal Server error" });
    }
};

export const getCartByCID = async (req, res) => {
    try {
        const id = req.params.id;
        const result = await Cart.getCartByCID(id);
        for (const item of result) {
            if (item.variant_id !== null) {
                const attribute_value = await Attribute.getByVariantId(item.variant_id);
                // split attribute_value to string
                let attribute_value_str = "";
                attribute_value_str += attribute_value[0].attribute_value;
                for (let i = 1; i < attribute_value.length; i++) {
                    attribute_value_str += ", " + attribute_value[i].attribute_value;
                }
                item.attribute_value = attribute_value_str;
            }
        }

        const cartItems = [];
        for (const item of result) {
            const productId = item.product_id;

            const productPromise = Product.getProductById(productId);
            const attributesPromise = Attribute.getAttributesByPID(productId);
            const variantsPromise = Variant.getByPID(productId);
            const galleriesPromise = Gallery.getByPID(productId);

            const [product, attributes, variants, galleries] = await Promise.all([productPromise, attributesPromise, variantsPromise, galleriesPromise]);

            var attribute = attributes.map((attribute) => attribute.attribute_name);
            var gallery = galleries.map((gallery) => gallery.image_path);

            var attribute_id = attributes.map((attribute) => attribute.id);

            //get attribute values for each attribute id
            var attributeValues = [];
            for (let j = 0; j < attribute_id.length; j++) {
                const attributeValue = await Attribute.getAttributeValues(attribute_id[j]);
                attributeValues.push(attributeValue.map((attributeValue) => attributeValue.attribute_value));
            }

            const response = {
                id: item.id,
                quantity: item.quantity,
                variant_id: item.variant_id,
                attribute_values: item.attribute_value,
                product: { ...product[0], attributes: attribute, attribute_values: attributeValues, variants, galleries: gallery },
            };

            cartItems.push({ ...response });
        }

        return res.status(200).json(cartItems);
    } catch (error) {
        console.error("Error during getting cart by customer ID:", error);
        return res.status(500).json({ error: "Internal Server error" });
    }
};

export const getCartOrderItems = async (req, res) => {
    try {
        const idList = req.body.idList;
        const cartItems = [];
        const cartOderItems = [];
        for (let i = 0; i < idList.length; i++) {
            const result = await Cart.getCartByID(idList[i]);
            const item = result[0];
            if (item.variant_id !== null) {
                const attribute_value = await Attribute.getByVariantId(item.variant_id);
                // split attribute_value to string
                let attribute_value_str = "";
                attribute_value_str += attribute_value[0].attribute_value;
                for (let i = 1; i < attribute_value.length; i++) {
                    attribute_value_str += ", " + attribute_value[i].attribute_value;
                }
                item.attribute_value = attribute_value_str;
            }
            cartItems.push(item);
        }

        for (const item of cartItems) {
            const productId = item.product_id;

            const productPromise = Product.getProductById(productId);
            const attributesPromise = Attribute.getAttributesByPID(productId);
            const variantsPromise = Variant.getByPID(productId);
            const galleriesPromise = Gallery.getByPID(productId);

            const [product, attributes, variants, galleries] = await Promise.all([productPromise, attributesPromise, variantsPromise, galleriesPromise]);

            var attribute = attributes.map((attribute) => attribute.attribute_name);
            var gallery = galleries.map((gallery) => gallery.image_path);

            var attribute_id = attributes.map((attribute) => attribute.id);

            //get attribute values for each attribute id
            var attributeValues = [];
            for (let j = 0; j < attribute_id.length; j++) {
                const attributeValue = await Attribute.getAttributeValues(attribute_id[j]);
                attributeValues.push(attributeValue.map((attributeValue) => attributeValue.attribute_value));
            }

            const response = {
                id: item.id,
                quantity: item.quantity,
                variant_id: item.variant_id,
                attribute_values: item.attribute_value,
                product: { ...product[0], attribute, attributeValues, variants, gallery },
            };

            cartOderItems.push({ ...response });
        }


        return res.status(200).json(cartOderItems);
    } catch (error) {
        console.error("Error during getting cart items:", error);
        return res.status(500).json({ error: "Internal Server error" });
    }
}
