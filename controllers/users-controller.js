const {fetchUserById, updateUser} = require("../models/users-model")

exports.getUserById = async (req, res, next) => {
    const {id} = req.params
    const user = await fetchUserById(id)
    res.status(200).send({user})
}

exports.patchUser = async(req, res, next) => {
    const {id} = req.params
    const update = req.body
    const updatedUser = await updateUser(id, update)
    res.status(200).send(updatedUser)
}
 