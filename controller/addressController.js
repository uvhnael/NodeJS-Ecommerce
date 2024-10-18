import Address from "../model/mysql/addressModel.js";

export const addAddress = async (req, res) => {
    try {
        const address = new Address(req.body);
        await Address.addAddress(address);

        res.status(201).json({ message: "Address added successfully" });

    } catch (error) {
        console.error("Error during address addition:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
};

export const updateAddress = async (req, res) => {
    try {
        const address = new Address(req.body);
        await Address.updateAddress(address);

        res.status(200).json({ message: "Address updated successfully" });

    } catch (error) {
        console.error("Error during address update:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
};

export const deleteAddress = async (req, res) => {
    try {

        const { id } = req.params;
        await Address.deleteAddress(id);

        res.status(200).json({ message: "Address deleted successfully" });

    } catch (error) {
        console.error("Error during address deletion:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
};

export const getAddresses = async (req, res) => {
    try {

        const { id } = req.params;
        const addresses = await Address.getAddress(id);

        res.status(200).json(addresses);

    } catch (error) {
        console.error("Error during getting addresses:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
};

export const getDefaultAddress = async (req, res) => {
    try {

        const { id } = req.params;
        const address = await Address.getDefaultAddress(id);

        res.status(200).json(address[0]);

    } catch (error) {
        console.error("Error during getting default address:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
};

export const updateDefaultAddress = async (req, res) => {
    try {

        const address = new Address(req.body);
        await Address.updateDefaultAddress(address);

        res.status(200).json({ message: "Default address updated successfully" });

    } catch (error) {
        console.error("Error during default address update:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
};

export const fetchCity = async (req, res) => {
    try {
        const cities = await Address.fetchCity();
        res.status(200).json(cities);
    } catch (error) {
        console.error("Error during fetching cities:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}

export const fetchDistrict = async (req, res) => {
    try {
        const { city } = req.params;
        const states = await Address.fetchDistrict(city);
        res.status(200).json(states);
    } catch (error) {
        console.error("Error during fetching states:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}

export const fetchWard = async (req, res) => {
    try {
        const { district } = req.params;
        const wards = await Address.fetchWard(district);
        res.status(200).json(wards);
    } catch (error) {
        console.error("Error during fetching wards:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
}

