const {fetchUserById} = require("../models/users-model")

exports.getUserById = async (req, res, next) => {
    const {id} = req.params
    const user = await fetchUserById(id)
    res.status(200).send({user})
}
