const { fetchProperties, fetchProperty, fetchPropertyReviews, postPropertyReview} = require("../models/properties-model")

exports.getProperties = async (req, res, next) => {
    const properties = await fetchProperties()
    res.status(200).send({properties})

} 

exports.getPropertyById = async (req, res, next) => {
    const {id} = req.params
    const property = await fetchProperty(id)
    if(property.property_name){
        res.status(404).send({message:'404 Error! Property not found'})
    }
    else res.status(200).send({property})
}

exports.getPropertyReviews = async (req, res, next) => {
    const {id} = req.params
    const reviews = await fetchPropertyReviews(id)
    res.status(200).send({reviews})
}

exports.addPropertyReview = async (req, res, next) => {
    const {id, payload} = req.params
    const review = await postPropertyReview(id, payload)
    res.status(201).send(review)
}
