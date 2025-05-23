const db = require('./connection')
const {propertiesData} = require('./data/test/index')

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

async function extractUser(toExtract){
    return db.query(`SELECT * FROM users WHERE first_name = '${toExtract}'`).then(({rows})=>{
        return rows[0]
    })
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

async function extractProperty(toExtract){
    return db.query(`SELECT * FROM properties WHERE name = '${toExtract}'`).then(({rows})=>{
        return rows[0]
    })
}

function addUserId(propertiesOriginal, users) {
    const properties = JSON.parse(JSON.stringify(propertiesOriginal))
    const newProperties = properties.map((property) => {
            delete property.amenities
            const names = property.host_name.split(' ')
            const firstName = names[0]
            for (let i=0; i<users.length; i++){
                if(users[i].first_name === firstName){
            property.host_id = users[i].user_id
            delete property.host_name
            return property
                }
            }
        })
    return toInput(newProperties)
}

function changeGuestAndPropId(originalToChange, users, properties) {
    const reviews = JSON.parse(JSON.stringify(originalToChange))
    const newReviews = reviews.map((review) => {
        const names = review.guest_name.split(' ')
        const firstName = names[0];
        for (let i=0; i<users.length; i++){
            if(users[i].first_name === firstName){
            review.guest_id = users[i].user_id
            delete review.guest_name
            }
        }
        for (let i=0; i<properties.rows.length; i++){
            if (properties.rows[i].name === review.property_name){
            review.property_id = properties.rows[i].property_id
            delete review.property_name
            return review
            }
        }
        })
        return toInput(newReviews)
}

function addPropId(imagesOriginal, properties) {
    const images = JSON.parse(JSON.stringify(imagesOriginal))
    const newImages = images.map((image) => {
        for (let i =0; i<properties.rows.length; i++){
        if(image.property_name === properties.rows[i].name){
        image.property_id = properties.rows[i].property_id
        delete image.property_name
        return image
            }
        }
    })
    return toInput(newImages)
}

function addAmenities(properties){
    const amenitiesTotal = []
    for (let i=0; i<properties.length; i++){
        const toAdd = properties[i].amenities
        amenitiesTotal.push(toAdd)
    }
    const amenitiesFlat = amenitiesTotal.flat()
    const amenitiesToTest = []
    amenitiesToReturn = []
    for (let i=0; i<amenitiesFlat.length; i++){
        if (!amenitiesToTest.includes(amenitiesFlat[i])){
            amenitiesToTest.push(amenitiesFlat[i])
            amenitiesToReturn.push([amenitiesFlat[i]])
        }
    }
    return amenitiesToReturn
}

async function propertyAmenities(properties){
        const propAmenities = JSON.parse(JSON.stringify(properties))
        const newProps = await Promise.all(
        propAmenities.map(async (amenity) => {
        const propertyInfo = await extractProperty(amenity.name)
        amenity.property_id = propertyInfo.property_id
        delete amenity.name
        delete amenity.property_type
        delete amenity.price_per_night
        delete amenity.location
        delete amenity.description
        delete amenity.host_name
        return amenity
        })
    )
    return toInput(newProps)
}


module.exports = {toInput, isHost, addUserId, changeGuestAndPropId, extractProperty, extractUser, addPropId, addAmenities, propertyAmenities}