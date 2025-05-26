const db = require('../db/connection')

exports.fetchUserById = async (id) => {
    const {rows} = await db.query(`SELECT user_id, first_name, surname, email, phone_number, avatar, created_at
        FROM users
        WHERE users.user_id = $1;`, [id])
        return rows[0]
}