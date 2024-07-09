const { poolPromise, sql } = require('../config/db');

async function getAllUsers() {
    try {
        const pool = await poolPromise;
        const result = await pool.request().execute('SpGetAllUsers');
        return result.recordset;
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

async function getUserById(id) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .execute('SpGetUserById');
        return result.recordset[0];
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

async function createUser(user) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Name', sql.NVarChar(50), user.name)
            .input('Email', sql.NVarChar(50), user.email)
            .input('Age', sql.Int, user.age)
            .execute('SpCreateUser');
        return result.recordset[0];
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

async function updateUser(id, user) {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('Id', sql.Int, id)
            .input('Name', sql.NVarChar(50), user.name)
            .input('Email', sql.NVarChar(50), user.email)
            .input('Age', sql.Int, user.age)
            .execute('SpUpdateUser');
        return result.recordset[0];
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

async function deleteUser(id) {
    try {
        const pool = await poolPromise;
        await pool.request()
            .input('Id', sql.Int, id)
            .execute('SpDeleteUser');
    } catch (err) {
        console.error('SQL error', err);
        throw err;
    }
}

module.exports = {
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser
};