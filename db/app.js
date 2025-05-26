const express = require("express")
const {getProperties, getPropertyById, getPropertyReviews, addPropertyReview} = require("../controllers/properties-controller")
const {getUserById} = require("../controllers/users-controller")

const app = express()

app.get("/api/properties", getProperties)

app.get("/api/properties/:id", getPropertyById)

app.get("/api/properties/:id/reviews", getPropertyReviews)

app.get("/api/users/:id", getUserById)

app.post("/api/properties/:id/reviews", addPropertyReview)

module.exports = app