const { fetchProperties, fetchProperty, fetchPropertyReviews, postPropertyReview, removePropertyReview} = require("../models/properties-model")

exports.getProperties = async (req, res, next) => {
    const sortBy = req.query
    const properties = await fetchProperties(sortBy)
    res.status(200).send({properties})

} 

exports.getPropertyById = async (req, res, next) => {
    const {id} = req.params
    try{
    const property = await fetchProperty(id)
     res.status(200).send({property})
    } catch (error){
        next(error)
    }
}

exports.getPropertyReviews = async (req, res, next) => {
    const {id} = req.params
    const reviews = await fetchPropertyReviews(id)
    res.status(200).send({reviews})
}

exports.addPropertyReview = async (req, res, next) => {
    const {id} = req.params
    const  {guest_id, rating, comment} = req.body
    const review = await postPropertyReview(id, guest_id, rating, comment)
    res.status(201).send(review)
}

exports.deletePropertyReview = async (req, res, next) => {
    const {id} = req.params
    const review = await removePropertyReview(id)
    if (review === undefined){
        res.status(204).send({})
    }
}
