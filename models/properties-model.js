const db = require('../db/connection')

exports.fetchProperties = async () => {
  const {rows} =  await db.query(`SELECT properties.property_id, name, location, price_per_night, CONCAT(first_name, ' ', surname) AS host_name, COUNT(favourites.property_id) AS times_favourited
    FROM properties
    JOIN users
    ON users.user_id = properties.host_id
    JOIN favourites
    ON favourites.property_id = properties.property_id
    GROUP BY properties.property_id, users.first_name, users.surname
    ORDER BY times_favourited DESC, property_id ASC;`)
  return rows
}

exports.fetchProperty = async (id) => {
    const {rows} = await db.query(`SELECT properties.property_id, name AS property_name, location, price_per_night, 
    description, CONCAT(first_name, ' ', surname) AS host_name, avatar AS host_avatar,
    COUNT(favourites.property_id) AS favourite_count
    FROM properties
    JOIN users
    ON users.user_id = properties.host_id
    JOIN favourites
    ON favourites.property_id = properties.property_id
    WHERE properties.property_id = $1
    GROUP BY properties.property_id, users.first_name, users.surname, users.avatar;`, [id])
    return rows[0]
}


exports.fetchPropertyReviews = async (id) => {
    const {rows} = await db.query(`SELECT review_id, comment, rating, reviews.created_at, CONCAT(first_name, ' ', surname) AS guest_name, avatar AS guest_avatar
        FROM reviews
        JOIN properties
        ON properties.property_id = reviews.property_id
        JOIN users
        ON users.user_id = reviews.guest_id
        WHERE reviews.property_id = $1
        ORDER BY created_at ASC;`, [id])
        return rows
}

exports.postPropertyReview = async (id, payload) => {
    return 'hello'
}
