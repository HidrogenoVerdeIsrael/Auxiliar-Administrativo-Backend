const pool = require('../config/db');

const getUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM usuario WHERE email=$1', [email]);
    return result.rows[0];
};

const getAllUsers = async () => {
    const result = await pool.query('SELECT * FROM usuario');
    return result.rows;
};

const createUser = async (nombre, edad, email, hashedPassword) => {
    const result = await pool.query(
        'INSERT INTO usuario (nombre, edad, email, password) VALUES ($1, $2, $3, $4) RETURNING *',
        [nombre, edad, email, hashedPassword]
    );
    return result.rows[0];
};

const updateUser = async (id, nombre, edad, email, hashedPassword) => {
    const result = await pool.query(
        'UPDATE usuario SET nombre=$1, edad=$2, email=$3, password=$4 WHERE id=$5 RETURNING *',
        [nombre, edad, email, hashedPassword, id]
    );
    return result.rows[0];
};

const deleteUser = async (id) => {
    const result = await pool.query('DELETE FROM usuario WHERE id=$1 RETURNING *', [id]);
    return result.rows[0];
};

module.exports = { getUserByEmail, getAllUsers, createUser, updateUser, deleteUser };
