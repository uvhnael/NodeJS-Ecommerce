import Gallery from "../model/mysql/galleryModel.js";

export const deleteGallery = async (req, res) => {
    try {
        const id = req.params.id;
        await Gallery.delById(id);
        res.status(200).send("Gallery deleted successfully");
    } catch (err) {
        console.error("Error deleting gallery:", err);
        res.status(500).json({ error: "Error deleting gallery" });
    }
}