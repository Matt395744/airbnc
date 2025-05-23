const seed = require('./seed')
const db = require('./connection')
const {propertyTypesData, usersData, propertiesData, reviewsData, favouritesData, imagesData, bookingsData} = require('./data/test/index')
const { addAmenities } = require('./util')

 seed(propertyTypesData, usersData, propertiesData, reviewsData, favouritesData, imagesData, bookingsData, addAmenities).then(()=> {
    db.end()
 })

