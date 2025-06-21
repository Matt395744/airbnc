
exports.handlePathNotFound= (req, res, next) => {
    res.status(404).send({msg:'path not found'})
}

exports.handleBadRequests = (err, req, res, next) => {
    res.status(400).send({msg:'bad request'})
}

exports.handleCustomErrors = (err, req, res, next) => {
        if (err.status){
    res.status(err.status).send({msg: err.msg})
        }
        else {
        next(err)
    }
}
