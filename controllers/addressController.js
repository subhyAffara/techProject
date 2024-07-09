const addressModel = require('../models/addressModel');

async function getAddresses(req, res) {
    try {
        const addresses = await addressModel.getAllAddresses();
        res.status(200).json(addresses);
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

async function getAddress(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: 'Invalid address ID' });
    }

    try {
        const address = await addressModel.getAddressById(id);
        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }
        res.status(200).json(address);
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

async function createAddress(req, res) {
    const { userId, street, city, state, zipCode } = req.body;
    if (!userId || !Number.isInteger(parseInt(userId, 10)) || parseInt(userId, 10) <= 0) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    if (!street || typeof street !== 'string' || street.length > 100) {
        return res.status(400).json({ message: 'Invalid street' });
    }
    if (!city || typeof city !== 'string' || city.length > 50) {
        return res.status(400).json({ message: 'Invalid city' });
    }
    if (!state || typeof state !== 'string' || state.length > 50) {
        return res.status(400).json({ message: 'Invalid state' });
    }
    if (!zipCode || typeof zipCode !== 'string' || zipCode.length > 20) {
        return res.status(400).json({ message: 'Invalid zip code' });
    }

    try {
        const address = await addressModel.createAddress({ userId, street, city, state, zipCode });
        res.status(201).json(address);
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

async function updateAddress(req, res) {
    const id = parseInt(req.params.id, 10);
    const { street, city, state, zipCode } = req.body;

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: 'Invalid address ID' });
    }
    if (!street || typeof street !== 'string' || street.length > 100) {
        return res.status(400).json({ message: 'Invalid street' });
    }
    if (!city || typeof city !== 'string' || city.length > 50) {
        return res.status(400).json({ message: 'Invalid city' });
    }
    if (!state || typeof state !== 'string' || state.length > 50) {
        return res.status(400).json({ message: 'Invalid state' });
    }
    if (!zipCode || typeof zipCode !== 'string' || zipCode.length > 20) {
        return res.status(400).json({ message: 'Invalid zip code' });
    }

    try {
        const address = await addressModel.updateAddress(id, { street, city, state, zipCode });
        res.status(200).json(address);
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

async function deleteAddress(req, res) {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ message: 'Invalid address ID' });
    }

    try {
        await addressModel.deleteAddress(id);
        res.status(200).send('Address deleted');
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

module.exports = {
    getAddresses,
    getAddress,
    createAddress,
    updateAddress,
    deleteAddress
};