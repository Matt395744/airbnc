const db = require('./connection')

function toInput(data){
    const nestedArray = []
    for (let i=0; i<data.length; i++){
        const array = []
        for (const key in data[i]){
            array.push(data[i][key])
        }
        nestedArray.push(array)
    }
    return nestedArray
}

function isHost(user){
    const updatedUser = JSON.parse(JSON.stringify(user))
    for (const key in updatedUser){
    if(updatedUser[key].role === 'host'){
        delete updatedUser[key].role
        updatedUser[key].is_host = 'true'
    }
    else {
        delete updatedUser[key].role
        updatedUser[key].is_host = 'false'
    }
}
return toInput(updatedUser)
}

async function extractUser(toExtract){
    return db.query(`SELECT * FROM users WHERE first_name = '${toExtract}'`).then(({rows})=>{
        return rows[0]
    })
}

async function extractProperty(toExtract){
    return db.query(`SELECT * FROM properties WHERE name = '${toExtract}'`).then(({rows})=>{
        return rows[0]
    })
}

async function addUserId(propertiesOriginal) {
    const properties = JSON.parse(JSON.stringify(propertiesOriginal))
    const newProperties = await Promise.all(
        properties.map(async (property) => {
            delete property.amenities
            const names = property.host_name.split(' ')
            const firstName = names[0]
            const userInfo = await extractUser(firstName)
            property.host_id = userInfo.user_id
            delete property.host_name
            return property
        })
        
    )
    return toInput(newProperties)
}

async function changeGuestAndPropId(originalToChange) {
    const reviews = JSON.parse(JSON.stringify(originalToChange))
    const newReviews = await Promise.all(
        reviews.map(async (review) => {
        const names = review.guest_name.split(' ')
        const firstName = names[0];
        const userInfo = await extractUser(firstName)
        review.guest_id = userInfo.user_id
        delete review.guest_name
        const propertyInfo = await extractProperty(review.property_name)
        review.property_id = propertyInfo.property_id
        delete review.property_name
        return review
        }))
        return toInput(newReviews)

    }

async function addPropId(imagesOriginal) {
    const images = JSON.parse(JSON.stringify(imagesOriginal))
    const newImages = await Promise.all(
        images.map(async (image) => {
        const propertyInfo = await extractProperty(image.property_name)
        image.property_id = propertyInfo.property_id
        delete image.property_name
        return image
        })
    )
    return toInput(newImages)
}

module.exports = {toInput, isHost, addUserId, changeGuestAndPropId, extractProperty, extractUser, addPropId}