import Product from "../model/mysql/productModel.js";
import Attribute from "../model/mysql/attributeModel.js";
import Variant from "../model/mysql/variantModel.js";
import Gallery from "../model/mysql/galleryModel.js";
import Category from "../model/mysql/categoryModel.js";
import multer from "multer";

const multerStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // Directory where uploaded files will be saved
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '_' + file.originalname); // Unique filename
    }
});

const upload = multer({
    storage: multerStorage,
});

export const createProduct = async (req, res) => {
    try {
        upload.fields([{ name: 'images' }])(req, res, async (err) => {
            if (err) {
                console.error("Error uploading files:", err);
                return res.status(500).json({ error: "Error uploading files" });
            }

            console.log(req.body);

            const product = new Product(req.body);
            const attributes = JSON.parse(req.body.attributes);
            const variants = JSON.parse(req.body.variants);
            const attribute_value_ids = [];

            const productId = await Product.createProduct(product);

            const categoryId = req.body.category_id;
            Category.addByPID(productId, categoryId);

            const images = req.files['images'];
            const imagePaths = images.map(image => image.path);

            for (let i = 0; i < imagePaths.length; i++) {
                await Gallery.addByPID(productId, imagePaths[i], i === 0 ? 1 : 0, i + 1);
            }

            for (let i = 0; i < attributes.length; i++) {
                const attribute = attributes[i].name;
                const attributeId = await Attribute.addAttributes(attribute);
                await Attribute.addByPID(productId, attributeId);
                for (let j = 0; j < attributes[i].values.length; j++) {
                    const attributeValue = attributes[i].values[j];
                    let attribute_value_id = await Attribute.addAttributesValue(attributeId, attributeValue);
                    attribute_value_ids.push(attribute_value_id)
                }
            }

            if (attributes.length == 1) {
                for (let i = 0; i < variants.length; i++) {
                    const variant = variants[i]
                    const variantId = await Variant.addVariant(productId, variant.price, variant.quantity);
                    await Variant.addVariantAttributeValue(variantId, attribute_value_ids[i]);
                }
            }
            else if (attributes.length == 2) {
                const a1Len = attributes[0].values.length;
                const a2Len = attributes[1].values.length;
                for (let i = 0; i < a1Len; i++) {
                    for (let j = 0; j < a2Len; j++) {
                        const variant = variants[i * a2Len + j]
                        const variantId = await Variant.addVariant(productId, variant.price, variant.quantity);
                        await Variant.addVariantAttributeValue(variantId, attribute_value_ids[i]);
                        await Variant.addVariantAttributeValue(variantId, attribute_value_ids[a1Len + j]);
                    }
                }
            }



            res.status(200).json({ message: "Product added successfully" });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}

export const updateProduct = async (req, res) => {
    try {
        upload.fields([{ name: 'images' }])(req, res, async (err) => {
            if (err) {
                console.error("Error uploading files:", err);
                return res.status(500).json({ error: "Error uploading files" });
            }
            console.log(req.body);
            const productId = req.params.id;
            const product = new Product(req.body);
            const variants = JSON.parse(req.body.variants);

            await Product.updateProduct(productId, product);

            const images = req.files['images'];
            if (images != null) {
                const imagePaths = images.map(image => image.path);

                const galleries = await Gallery.getByPID(productId);
                const max_display_order = 0;
                const is_thumbnail = 0;

                for (let i = 0; i < galleries.length; i++) {
                    max_display_order = Math.max(max_display_order, galleries[i].display_order);
                    if (galleries[i].thumbnail == 1) {
                        is_thumbnail = 1;
                    }
                }

                max_display_order++;


                for (let i = 0; i < imagePaths.length; i++) {
                    await Gallery.addByPID(productId, imagePaths[i], is_thumbnail == 1 ? 0 : 1, max_display_order + 1);
                }
            }

            for (let i = 0; i < variants.length; i++) {
                const variant = variants[i];
                await Variant.updateVariant(variant.id, variant.price, variant.quantity);
            }

            res.status(200).json({ message: "Product updated successfully" });
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}

export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        await Product.deleteProduct(id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}


export const getProduct = async (req, res) => {
    try {
        const id = req.params.id;

        const productPromise = Product.getProductById(id);
        const attributesPromise = Attribute.getAttributesByPID(id);
        const variantsPromise = Variant.getByPID(id);
        const galleriesPromise = Gallery.getByPID(id);
        const categoriesPromise = Category.getByPID(id);

        const [product, attributes, variants, galleries, categories] = await Promise.all([productPromise, attributesPromise, variantsPromise, galleriesPromise, categoriesPromise]);

        var attribute = attributes.map((attribute) => attribute.attribute_name);
        var gallery = galleries;

        var attribute_id = attributes.map((attribute) => attribute.id);

        var attributeValues = [];
        for (let i = 0; i < attribute_id.length; i++) {
            const attributeValue = await Attribute.getAttributeValues(attribute_id[i]);
            attributeValues.push(attributeValue.map((attributeValue) => attributeValue.attribute_value));
        }

        const response = product[0];
        response.attributes = attribute;
        response.attribute_values = attributeValues;
        response.variants = variants;
        response.galleries = gallery;
        response.categories = categories;

        res.status(200).json(response);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}

export const getProductsByIdList = async (req, res) => {
    try {

        const idList = req.body.idList;
        var products = [];

        for (let i = 0; i < idList.length; i++) {

            var id = idList[i];

            const productPromise = Product.getProductById(id);
            const attributesPromise = Attribute.getAttributesByPID(id);
            const variantsPromise = Variant.getByPID(id);
            const galleriesPromise = Gallery.getByPID(id);

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

            const response = product[0];
            response.attributes = attribute;
            response.attribute_values = attributeValues;
            response.variants = variants;
            response.galleries = gallery;

            products.push(response);
        }
        res.status(200).json(products);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}

export const getProducts = async (req, res) => {
    try {
        const products = await Product.getProducts();
        res.status(200).json(products);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}

export const getProductsSearch = async (req, res) => {
    try {
        const search = req.params.search;
        const words = search.split(" ");

        let query = "SELECT product_id AS id, product_name, regular_price, image_path FROM products p, galleries g WHERE p.id = g.product_id AND g.thumbnail = 1 AND ( ";

        query += words.map((word) => `product_name LIKE '%${word}%'`).join(" OR ");

        query += ")";

        const params = words.map((word) => `%${word}%`);

        const products = await Product.searchProducts(query, params);

        let aQuery = "SELECT attribute_id FROM attributes a, attribute_values av WHERE a.id = av.attribute_id AND ( ";

        aQuery += words.map((word) => `attribute_value LIKE '%${word}%'`).join(" OR ");

        aQuery += ")";

        const attributeIdList = await Attribute.getProductByAttributeSearch(aQuery, params);

        if (attributeIdList.length !== 0) {
            const productAttribute = await Product.getProductByAttributeIdList(attributeIdList.map((attribute) => attribute.attribute_id));
            products.push(...productAttribute);
        }

        let vQuery = "SELECT product_id FROM categories c, product_categories p WHERE p.category_id = c.id AND ( ";

        vQuery += words.map((word) => `category_name LIKE '%${word}%'`).join(" OR ");

        vQuery += ")";

        const productIDlist = await Category.getProductByCategory(vQuery, params);

        if (productIDlist.length !== 0) {
            const productCategory = await Product.getProductByIDlist(productIDlist.map((product) => product.product_id));
            products.push(...productCategory);
        }

        // create a map to count the id
        const idMap = new Map();
        products.forEach((product) => {
            const id = product.id;
            if (idMap.has(id)) {
                idMap.set(id, idMap.get(id) + 1);
            } else {
                idMap.set(id, 1);
            }
        });

        // sort products by the number of id
        products.sort((a, b) => idMap.get(b.id) - idMap.get(a.id));

        // remove duplicates
        const uniqueProducts = products.filter((product, index, self) =>
            index === self.findIndex((t) => (
                t.id === product.id
            ))
        );



        res.status(200).json(uniqueProducts);
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}