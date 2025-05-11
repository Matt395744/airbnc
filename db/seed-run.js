const seed = require('./seed')
const db = require('./connection')
const {propertyTypesData, usersData, propertiesData, reviewsData, favouritesData, imagesData, bookingsData} = require('./data/test/index')

 seed(propertyTypesData, usersData, propertiesData, reviewsData, favouritesData, imagesData, bookingsData).then(()=> {
    db.end()
 })

