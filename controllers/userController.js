import userModel from '../models/userModel.js'; // Import the corrected userModel

async function getUsers(req, res) {
    try {
        const users = await userModel.getAllUsersFromDB(); // Call the MODEL function
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

async function getUserByIdController(req, res) { // Renamed to getUserByIdController to avoid confusion
    console.log("get user by id controller initiated");
    try {
        const user = await userModel.getUserByIdFromDB(req.params.id); // Call the MODEL function with ID from params
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error in getUserById controller:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

async function getUser(req, res) {
    console.log("get user by email controller initiated"); // Updated log message
    try {
        const user = await userModel.getUserByEmailFromDB(req.params.email); // Call the MODEL function for email lookup
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Error in getUserByEmail controller:", error); // Updated log message
        res.status(500).json({ message: 'Internal server error' });
    }
};


async function createNewUser(req, res) {
    console.log("create user controller initiated", req.body); // Added log for request body
    try {
        const insertedId = await userModel.createUserInDB(req.body); // Call the MODEL function to create user
        res.status(201).json({ id: insertedId, message: "User created successfully" });
    } catch (error) {
        console.error("Error in createNewUser controller:", error);
        res.status(500).json({ message: 'Internal server error' }); // Send JSON error response
    }
}


async function updateUser(req, res) {
    try {
        // Assuming you will create an updateUserInDB in userModel if needed
        // const user = await userModel.updateUserInDB(req.params.id, req.body);
        // res.status(200).json(user);
        res.status(501).send('Update user not implemented yet'); // Indicate not implemented
    } catch (error) {
        res.status(500).send('Server Error');
    }
}

async function deleteUser(req, res) {
    try {
        const deletedCount = await userModel.deleteUserFromDB(req.params.id); // Call the MODEL function to delete user
        if (deletedCount > 0) {
            res.status(200).send('User deleted');
        } else {
            res.status(404).json({ message: 'User not found for deletion' }); // User not found for deletion
        }

    } catch (error) {
        res.status(500).send('Server Error');
    }
}

export default {
    getUsers,
    getUser,
    createNewUser,
    updateUser,
    deleteUser,
    getUserById: getUserByIdController // Export with original name, but using the Controller function
};