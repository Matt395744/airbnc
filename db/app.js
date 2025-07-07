const express = require("express")
const {getProperties, getPropertyById, getPropertyReviews, addPropertyReview} = require("../controllers/properties-controller")
const {getUserById, patchUser} = require("../controllers/users-controller")
const { deletePropertyReview } = require("../controllers/properties-controller")
const {handlePathNotFound, handleBadRequests, handleCustomErrors} = require("../controllers/errors")
const cors = require('cors')

const app = express()

app.use(cors())

app.use(express.json())

app.get("/api/properties", getProperties)

app.get("/api/properties/:id", getPropertyById)

app.get("/api/properties/:id/reviews", getPropertyReviews)

app.get("/api/users/:id", getUserById)

app.post("/api/properties/:id/reviews", addPropertyReview)

app.delete("/api/reviews/:id", deletePropertyReview)

app.patch("/api/users/:id", patchUser)

app.all("/*badpath", handlePathNotFound)

app.use(handleCustomErrors)

app.use(handleBadRequests)

module.exports = app