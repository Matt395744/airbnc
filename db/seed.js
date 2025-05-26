const db = require("./connection")
const {toInput, isHost, addUserId, changeGuestAndPropId, addPropId, propertyAmenities} = require("./util")
const format = require('pg-format')

async function seed (propertyTypesData, usersData, propertiesData, reviewsData, favouritesData, imagesData, bookingsData, addAmenities) {

await db.query(`DROP TABLE IF EXISTS propertiesAmenities;`) 
await db.query(`DROP TABLE IF EXISTS amenities;`)
await db.query(`DROP TABLE IF EXISTS bookings;`) 
await db.query(`DROP TABLE IF EXISTS images;`)
await db.query(`DROP TABLE IF EXISTS favourites;`)
await db.query(`DROP TABLE IF EXISTS reviews;`)
await db.query(`DROP TABLE IF EXISTS properties;`)
await db.query(`DROP TABLE IF EXISTS users;`)
await db.query(`DROP TABLE IF EXISTS property_types;`)

await db.query(`CREATE TABLE property_types (
    property_type VARCHAR PRIMARY KEY NOT NULL,
    description TEXT
    );`);

await db.query(`CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    surname VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    phone_number VARCHAR,
    avatar VARCHAR,
    is_host BOOLEAN,
    created_at TIMESTAMP );`);

await db.query(`CREATE TABLE properties (
    property_id SERIAL PRIMARY KEY,
    host_id INT NOT NULL REFERENCES users(user_id),
    name VARCHAR NOT NULL,
    location VARCHAR NOT NULL,
    property_type VARCHAR NOT NULL REFERENCES property_types(property_type),
    price_per_night DECIMAL NOT NULL,
    description TEXT );`);

await db.query(`CREATE TABLE reviews (
    review_id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES properties(property_id),
    guest_id INT NOT NULL REFERENCES users(user_id),
    rating INT NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`);

await db.query(`CREATE TABLE favourites (
    favourite_id SERIAL PRIMARY KEY,
    guest_id INT NOT NULL REFERENCES users(user_id),
    property_id INT NOT NULL REFERENCES properties(property_id));`);

await db.query(`CREATE TABLE images (
    image_id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES properties(property_id),
    image_url VARCHAR NOT NULL,
    alt_text VARCHAR NOT NULL);`);

await db.query(`CREATE TABLE bookings (
    booking_id SERIAL PRIMARY KEY,
    property_id INT NOT NULL REFERENCES properties(property_id),
    guest_id INT NOT NULL REFERENCES users(user_id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP);`);

await db.query(`CREATE TABLE amenities (
    amenity VARCHAR PRIMARY KEY);`);

// await db.query(`CREATE TABLE properties_amenities (
//     property_amenities SERIAL PRIMARY KEY,
//     property_id INT NOT NULL REFERENCES properties(property_id),
//     amenity_slug VARCHAR NOT NULL REFERENCES amenities(amenity));`);


 const propertyTypes = await db.query(
   format(`INSERT INTO property_types (property_type, description) VALUES %L RETURNING *`, 
    toInput(propertyTypesData)));


const users = await db.query(
    format(`INSERT INTO users ( first_name, surname, email, phone_number, avatar, is_host)
        VALUES %L RETURNING *`, isHost(usersData)));

        const userRows = users.rows

const properties = await db.query(
    format(`INSERT INTO properties (name, property_type, location,  price_per_night, description, host_id) 
        VALUES %L RETURNING *`, addUserId(propertiesData, userRows)));

const reviews = await db.query(
    format(`INSERT INTO reviews (rating, comment, guest_id, property_id)
        VALUES %L RETURNING *`, changeGuestAndPropId(reviewsData, userRows, properties)));

const favourites =  await db.query(
    format(`INSERT INTO favourites (guest_id, property_id) 
        VALUES %L RETURNING *`, changeGuestAndPropId(favouritesData, userRows, properties)));

const images = await db.query(
    format(`INSERT INTO images (image_url, alt_text, property_id)
        VALUES %L RETURNING *`, addPropId(imagesData, properties)));

const bookings = await db.query(
    format(`INSERT INTO bookings (check_in_date, check_out_date, guest_id, property_id)
        VALUES %L RETURNING *`, changeGuestAndPropId(bookingsData, userRows, properties)));

const amenitites = await db.query(
    format(`INSERT INTO amenities (amenity)
        VALUES %L RETURNING *`, addAmenities(propertiesData)));

// const amenityInput = await propertyAmenities(propertiesData)
// This function needs to separate each amenity with each property id into their own array, not each property id with all amenities

// await db.query(
//     format(`INSERT INTO properties_amenities (property_id, amenity_slug)
//         VALUES %L`, amenityInput));
}
   
module.exports = seed
