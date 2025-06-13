const request = require("supertest")
const app = require("../db/app")
const seed = require("../db/seed")
const { addAmenities } = require('../db/util')
const {propertyTypesData, usersData, propertiesData, reviewsData, favouritesData, imagesData, bookingsData} = require('../db/data/test/index')
const db = require("../db/connection")

afterAll(() => {
    db.end()
})

beforeEach(async() => {
    await  seed(propertyTypesData, usersData, propertiesData, reviewsData, favouritesData, imagesData, bookingsData, addAmenities)
})
describe('error handler for non existent path', () => {
    test('non existent endpoint responds with 404 and msg', async () => {
        const {body} = await request(app).get("/api/false-path").expect(404)
        expect(body.msg).toBe('path not found')
    })
})
describe('getProperties', () => {
    test('get request from api/properties responds with status of 200', async () => {
        await request(app).get("/api/properties").expect(200)
    })
    test('get request to api/properties responds with an array of properties that contain name, host_name etc', async () => {
        const {body} = await request(app).get("/api/properties")
        expect(Array.isArray(body.properties)).toBe(true)
        expect(body.properties.length > 0).toBe(true)
        body.properties.forEach(property => {
            expect(property.hasOwnProperty("name")).toBe(true)
            expect(property.hasOwnProperty("property_id")).toBe(true)
            expect(property.hasOwnProperty("host_name")).toBe(true)
        })
    })
    test('max price query should return properties under the max price per night ', async () => {
        await request(app).get("/api/properties?maxprice=110").expect(200)
        const {body} = await request(app).get("/api/properties?maxprice=110")
        expect(body).toEqual({
      properties: [
        {
          property_id: 3,
          name: 'Chic Studio Near the Beach',
          location: 'Brighton, UK',
          price_per_night: '90',
          host_name: 'Alice Johnson',
          times_favourited: '1'
        },
        {
          property_id: 4,
          name: 'Elegant City Apartment',
          location: 'Birmingham, UK',
          price_per_night: '110',
          host_name: 'Emma Davis',
          times_favourited: '1'
        },
        {
          property_id: 5,
          name: 'Charming Studio Retreat',
          location: 'Bristol, UK',
          price_per_night: '85',
          host_name: 'Emma Davis',
          times_favourited: '1'
        },
        {
          property_id: 8,
          name: 'Seaside Studio Getaway',
          location: 'Cornwall, UK',
          price_per_night: '95',
          host_name: 'Emma Davis',
          times_favourited: '1'
        }
      ]
    })

    })
    test('min price query should return properties above the min price specified', async() => {
        const {body} = await request(app).get("/api/properties?minprice=200")
    })
    test('get using a host id should just return the properties from that host', async() => {
        await request(app).get('/api/properties?host=3').expect(200)
        const {body} = await request(app).get('/api/properties?host=3')
        expect(body).toEqual({
      properties: [
        {
          property_id: 4,
          name: 'Elegant City Apartment',
          location: 'Birmingham, UK',
          price_per_night: '110',
          host_name: 'Emma Davis',
          times_favourited: '1'
        },
        {
          property_id: 5,
          name: 'Charming Studio Retreat',
          location: 'Bristol, UK',
          price_per_night: '85',
          host_name: 'Emma Davis',
          times_favourited: '1'
        },
        {
          property_id: 8,
          name: 'Seaside Studio Getaway',
          location: 'Cornwall, UK',
          price_per_night: '95',
          host_name: 'Emma Davis',
          times_favourited: '1'
        }
      ]
    })
    })
    test('get using sort will arrange in ascending or descending order of cost orm popularity', async() => {
        await request(app).get('/api/properties?sort=price_per_night').expect(200)
    })
})


describe('getProperty by ID', () => {
    test('get request by ID responds with 200 status', async () =>{
        await request(app).get("/api/properties/2").expect(200)
    })
    test('get request to api/properties/:id responds with an object of a property that contains name, id etc', async () => {
    const {body} = await request(app).get("/api/properties/4")
        expect(body.property.hasOwnProperty("property_name")).toBe(true)
        expect(body.property.hasOwnProperty("property_id")).toBe(true)
        expect(body.property.hasOwnProperty("favourite_count")).toBe(true)
})
test('should log an error if no property with that ID', async() => {
    const {body} = await request(app).get("/api/properties/400")
})
    test('invalid ID responds with 400 and message', async() => {
        const {body} = await request(app).get("/api/properties/invalied-id").expect(400)
        
        expect(body.msg).toBe('bad request')
    })
    test('valid ID but non-existent responds with 404 and message', async () => {
        const {body} = await request(app).get('/api/properties/1234').expect(404)
        expect(body.msg).toBe('property not found')
    })
})

describe('get property reviews by ID', () => {
    test('get reviews request by ID responds with 200 status', async() => {
        await request(app).get("/api/properties/2/reviews").expect(200)
    })
        test('get request to api/properties/:id/reviews responds with an array of reviews that contains name, rating etc', async () => {
        const {body} = await request(app).get("/api/properties/4/reviews")
        expect(Array.isArray(body.reviews)).toBe(true)
        expect(body.reviews.length > 0).toBe(true)
        expect(body.reviews[0].hasOwnProperty("comment")).toBe(true)
        expect(body.reviews[0].hasOwnProperty("review_id")).toBe(true)
    })
})

describe('get users by ID', () => {
    test('get user by ID returns with status 200', async () => {
    await request(app).get("/api/users/2").expect(200)    
    })
    test('get request to api/users/:id responds with a property of a user that contains user_id, first_name etc', async () => {
    const {body} = await request(app).get("/api/users/2")
        expect(body.user.hasOwnProperty("user_id")).toBe(true)
        expect(body.user.hasOwnProperty("first_name")).toBe(true)
})
    test('verify corrrect user is selected', async () => {
        const {body} = await request(app).get("/api/users/2")
        expect(body.user.first_name).toBe('Bob')
        expect(body.user.surname).toBe('Smith')
    })
})

describe('should insert new reviews into the reviews table', () => {
    test('post property review should resolve with a status of 201', async () => {
     await request(app).post("/api/properties/3/reviews").send({guest_id:1, rating:4, comment:'holy guacamole'}).expect(201)
    })
    test('returns the new review with added information', async() => {
        const {body} = await request(app).post("/api/properties/3/reviews").send({guest_id:1, rating:4, comment:'holy guacamole'})
        expect(typeof body).toBe('object')
        expect(body.guest_id).toBe(1)
    })
})
describe('should delete review chosen by review id from database', () => {
    test('delete review should resolve with a status of 204', async () => {
        await request(app).delete("/api/reviews/3").expect(204)
    })
    test('delete review should resolve with an statement saying object has been deleted', async () => {
        const {body} = await request(app).delete("/api/reviews/3")
        expect(body).toEqual({})
})
})