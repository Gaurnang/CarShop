import pool from "../config/db.js";


export const fetchAllUsers = async() => {
    const query = `
       select * from users;
    `;
    const result = await pool.query(query);
    return result.rows;
}

export const fetchUserById = async(userId) => {
    const query = `
    select * from users where id = $1;`
    const result = await pool.query(query, [userId]);
    return result.rows[0];
}


