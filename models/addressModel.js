const { poolPromise, sql } = require('../config/db');

async function getAllAddresses() {
    try {
        const pool = await poolPromise;
        const result = await pool.request().execute('GetAllAddresses');
        return result.recordset;
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

async function getAddressById(id) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserId', sql.Int, id)
            .execute('GetAddressById');
        return result.recordset[0];
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

async function createAddress(address) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserId', sql.Int, address.Id)
            .input('Street', sql.NVarChar(100), address.street)
            .input('City', sql.NVarChar(50), address.city)
            .input('State', sql.NVarChar(50), address.state)
            .input('ZipCode', sql.NVarChar(20), address.zipCode)
            .execute('CreateAddress');
        return result.recordset[0];
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

async function updateAddress(id, address) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('UserId', sql.Int, id)
            .input('Street', sql.NVarChar(100), address.street)
            .input('City', sql.NVarChar(50), address.city)
            .input('State', sql.NVarChar(50), address.state)
            .input('ZipCode', sql.NVarChar(20), address.zipCode)
            .execute('UpdateAddress');
        return result.recordset[0];
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

async function deleteAddress(id) {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('UserId', sql.Int, id)
            .execute('DeleteAddress');
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

module.exports = {
    getAllAddresses,
    getAddressById,
    createAddress,
    updateAddress,
    deleteAddress
};