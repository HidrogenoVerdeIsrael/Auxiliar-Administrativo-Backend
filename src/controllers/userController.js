const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getUserByEmail, getAllUsers, createUser, updateUser, deleteUser } = require('../models/userModel');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Faltan datos' });
        }

        const user = await getUserByEmail(email);

        if (!user) {
            return res.status(401).json({ message: 'Credenciales invalidas' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales invalidas' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            'hayderarenas',
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {httpOnly: true, secure: false, maxAge:3600000});
        res.json({message:"Autenticado exitosamente"})

    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error inesperado' });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await getAllUsers();
        res.json(users);
    } catch (error) {
        console.error(error.message);
    }
};

const addUser = async (req, res) => {
    try {
        const { nombre, edad, email, password } = req.body;

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await createUser(nombre, edad, email, hashedPassword);
        res.json(newUser);
    } catch (error) {
        console.error(error.message);
    }
};

const updateUserDetails = async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, edad, email, password } = req.body;

        let hashedPassword = password;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const updatedUser = await updateUser(id, nombre, edad, email, hashedPassword);
        res.json(updatedUser);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
};

const removeUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUser(id);
        res.json(deletedUser);
    } catch (error) {
        console.error(error.message);
    }
};

module.exports = { loginUser, getUsers, addUser, updateUserDetails, removeUser };
