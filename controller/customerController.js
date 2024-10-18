import Customer from "../model/mysql/customerModel.js";

export const getCustomerById = async (req, res) => {
    try {

        const { id } = req.params;
        const customer = await Customer.getCustomerById(id);

        res.status(200).json(customer[0]);

    } catch (error) {
        console.error("Error during getting customer:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
};

export const updateCustomer = async (req, res) => {
    try {
        const customer = new Customer(req.body);
        console.log("Customer:", customer);
        const customerData = await Customer.getCustomerById(customer.id);
        if (customerData.length === 0) {
            return res.status(404).json({ error: "Customer not found" });
        }
        const newCustomer = customerData[0];
        newCustomer.name = customer.name;
        newCustomer.email = customer.email;
        newCustomer.phone_number = customer.phone_number;

        await Customer.updateCustomer(newCustomer, newCustomer.id);

        res.status(200).json(newCustomer);

    } catch (error) {
        console.error("Error during customer update:", error);
        res.status(500).json({ error: "Internal Server error" });
    }
};

