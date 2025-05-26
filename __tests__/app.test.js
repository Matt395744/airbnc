const request = require("supertest")
const app = require("../db/app")
const seed = require("../db/seed")
const { addAmenities } = require('../db/util')
const {propertyTypesData, usersData, propertiesData, reviewsData, favouritesData, imagesData, bookingsData} = require('../db/data/test/index')


beforeEach(async() => {
    await  seed(propertyTypesData, usersData, propertiesData, reviewsData, favouritesData, imagesData, bookingsData, addAmenities)
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
        await request(app).post("/api/properties/:id/reviews").expect(201)
    })
})