const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// THIS IS ONLY FOR ADMIN!
const signup = async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;

    try {
        const user = await User.findOne({email: email});

        if(user){
            return res.status(400).send('User is already exists!');
        }
        const hashedPassword = await bcrypt.hash(password, 12);

        const createUser = await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            password: hashedPassword,
        });

        const token = jwt.sign({_id: createUser._id}, 'secretkey123', {
            expiresIn: '90d',
        });

        const responseObj = {
            message: 'Successfully created.',
            token,
            user: {
                _id: createUser._id,
                firstName: createUser.firstName,
                lastName: createUser.lastName,
                email: createUser.email,
                phone: createUser.phone,
            },
        };

        res.status(201).send(responseObj);
    } catch(e) {
        console.log('Error:', e);
        res.status(500).send('Internal server error.');
    }
};


const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({email});

        if(!user) {
            return res.status(404).send("Users not found!");
        }
        
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid){
            return res.status(401).send("Incorrect email or password");
        }

        if(user.role !== 'admin'){
            return res.status(401).send("Unauthorized.");
        }

        const token = jwt.sign({_id: user._id}, 'secretkey123', {
            expiresIn: '90d',
        });

        const responseObj = {
            message: 'Logged in successfully',
            token,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phone: user.phone
            },
        };

        res.status(200).send(responseObj);
    } catch(e) {
        res.status(500).send('Internal server error.');
    }
}

const getUser = async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send('User not found');
        }

        return res.status(200).json(user);
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Something went wrong...');
    }
}

const editUser = async (req, res) => {
    const id = req.params.id;

    const updatedInfo = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phone: req.body.phone,
    };

    try {
        const user = await User.findByIdAndUpdate(id, updatedInfo, {new: true});

        if (!user) {
            return res.status(404).send('User not found');
        }
        
        return res.status(201).send('User data has been updated.');
    } catch(e) {
        console.error('Error:', e);
        return res.status(500).send('Failed to update data');
    }
}

const userPass = async (req, res) => {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    try {
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).send('User not found');
        }

        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

        if (!isPasswordValid) {
            return res.status(401).send('Old password is incorrect');
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);

        await User.findByIdAndUpdate(id, { password: hashedNewPassword });

        return res.status(200).send('Password updated successfully');
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).send('Internal server error');
    }
}

module.exports = {
    login,
    getUser,
    editUser,
    userPass,
    signup
}