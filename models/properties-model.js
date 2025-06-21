const db = require('../db/connection')

exports.fetchProperties = async (sortBy) => {

    const key = Object.keys(sortBy)[0];
    let queryCondition = "";
    let queryParams = [];

    switch (key) {
        case "maxprice":
            queryCondition = `WHERE price_per_night <= $1`;
            queryParams.push(sortBy[key]);
            break;
        case "minprice":
            queryCondition = `WHERE price_per_night >= $1`;
            queryParams.push(sortBy[key]);
            break;
        case "host":
            queryCondition = `WHERE host_id = $1`;
            queryParams.push(sortBy[key]);
            break;
        default:
            break;
    }

  const {rows} =  await db.query(`SELECT properties.property_id, name, location, price_per_night, CONCAT(first_name, ' ', surname) AS host_name, COUNT(favourites.property_id) AS times_favourited
    FROM properties
    JOIN users
    ON users.user_id = properties.host_id
    JOIN favourites
    ON favourites.property_id = properties.property_id
    ${queryCondition}
    GROUP BY properties.property_id, users.first_name, users.surname
    ORDER BY times_favourited DESC, property_id ASC;`, queryParams )
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
    if (rows[0]===undefined){
      return Promise.reject({status:404, msg:'property not found'})
    }

    return rows[0]
}


exports.fetchPropertyReviews = async (id) => {
    const {rows: reviews} = await db.query(`SELECT review_id, comment, rating, reviews.created_at, CONCAT(first_name, ' ', surname) AS guest_name, avatar AS guest_avatar
        FROM reviews
        JOIN properties
        ON properties.property_id = reviews.property_id
        JOIN users
        ON users.user_id = reviews.guest_id
        WHERE reviews.property_id = $1
        ORDER BY created_at ASC;`, [id])
        if (reviews[0]=== undefined){
      return Promise.reject({status:404, msg:'review not found'})
    }
        const {rows: average} = await db.query(`SELECT AVG(rating) AS average_rating
          FROM reviews
          WHERE property_id = $1`, [id])
          const {average_rating} = average[0]
        return {reviews, average_rating}
}

exports.postPropertyReview = async (id, guest_id, rating, comment) => {
  try {
    const {rows : [review]} = await db.query(`INSERT INTO reviews (property_id, guest_id, rating, comment) VALUES ($1, $2,$3, $4) RETURNING *;`,
    [id, guest_id, rating, comment])
    return review
  } catch (error) {
    if(error.code === '23503'){
      return Promise.reject({status:404, msg:'key not found'})
    }
    return Promise.reject(error)
  }
}

exports.removePropertyReview = async (id) => {
  try{const {rowCount} = await db.query(`DELETE FROM reviews
    WHERE reviews.review_id = $1;`, [id]) 
    if (rowCount === 0){
      throw new Error('invalid ID')
    }
  return undefined
  } catch(error){
    if(error.message === 'invalid ID'){
      return Promise.reject({status:404, msg:'review not found'})
    }
    return Promise.reject(error)
  }
}
