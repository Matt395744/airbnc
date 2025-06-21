const db = require('../db/connection')

exports.fetchUserById = async (id) => {
    const {rows} = await db.query(`SELECT user_id, first_name, surname, email, phone_number, avatar, created_at
        FROM users
        WHERE users.user_id = $1;`, [id])
        if (rows[0]===undefined){
      return Promise.reject({status:404, msg:'user not found'})
    }
        return rows[0]
}
 
exports.updateUser = async(id, update) => {
    const keys = Object.keys(update)
   let updateString = keys.map((key, i) => `${key} = $${i + 2}`).join(", ");
    const queryParams = [id, ...keys.map(key => update[key])];
    try{
    const {rows} = await db.query(
        `UPDATE users SET ${updateString} WHERE user_id = $1 RETURNING *;`, 
        queryParams)
        if (rows[0]){
    return rows[0]
        }
        throw new Error('invalid ID')
    } catch(error){
        if (error.message === 'invalid ID'){
            return Promise.reject({status:404, msg:'user not found'})
        }
        if (error.code === '42703'){
            return Promise.reject({status:404, msg:'key not found'})
        }
        return Promise.reject(error)
    }

}