const {toInput, isHost, alterProperties, alterReviews, extractProperty, extractUser} = require("./util")
const {propertyTypesData, usersData, propertiesData, reviewsData} = require('./data/test/index')


describe('toInput creates an array of arrays out of objects within arrays to help readability for psql', () => {
   test('should return a nested array', () =>{
    expect(Array.isArray(toInput([{1:2},{3:4}]))).toBe(true)
    const nestArrayCheck = toInput([{1:2},{3:4}])
    expect(Array.isArray(nestArrayCheck[0])).toBe(true)
   })
   test('should leave original array unchanged', () => {
    const originArray = [{1:2},{3:4}]
    toInput([{1:2},{3:4}])
    expect(originArray).toEqual([{1:2},{3:4}])
   })
   test('should return new array of arrays containing correct elements', () =>{
    expect(toInput([{1:2},{3:4}])).toEqual([[2],[4]])
   })
})

describe('isHost should manipulate data to change the role line in the users database to a true or false string determining whether user is host', () =>{
    test('original array should be left unchanged', () => {
        isHost(usersData)
        expect(usersData).toEqual([
  {
    "first_name": "Alice",
    "surname": "Johnson",
    "email": "alice@example.com",
    "phone_number": "+44 7000 111111",
    "role": "host",
    "avatar": "https://example.com/images/alice.jpg"
  },
  {
    "first_name": "Bob",
    "surname": "Smith",
    "email": "bob@example.com",
    "phone_number": "+44 7000 222222",
    "role": "guest",
    "avatar": "https://example.com/images/bob.jpg"
  },
  {
    "first_name": "Emma",
    "surname": "Davis",
    "email": "emma@example.com",
    "phone_number": "+44 7000 333333",
    "role": "host",
    "avatar": "https://example.com/images/emma.jpg"
  },
  {
    "first_name": "Frank",
    "surname": "White",
    "email": "frank@example.com",
    "phone_number": "+44 7000 444444",
    "role": "guest",
    "avatar": "https://example.com/images/frank.jpg"
  },
  {
    "first_name": "Isabella",
    "surname": "Martinez",
    "email": "isabella@example.com",
    "phone_number": "+44 7000 555555",
    "role": "host",
    "avatar": "https://example.com/images/isabella.jpg"
  },
  {
    "first_name": "Rachel",
    "surname": "Cummings",
    "email": "rachel@example.com",
    "phone_number": "+44 7000 666666",
    "role": "guest",
    "avatar": "https://example.com/images/rachel.jpg"
  }
])
    })
    test('should return array of arrays', () => {
        const arrays = isHost(usersData)
        expect(Array.isArray(arrays)).toBe(true)
        expect(Array.isArray(arrays[0])).toBe(true)
    })
    test('should return correct output to put into psql', () => {
        expect(isHost(usersData)).toEqual([
      [
        'Alice',
        'Johnson',
        'alice@example.com',
        '+44 7000 111111',
        'https://example.com/images/alice.jpg',
        'true'
      ],
      [
        'Bob',
        'Smith',
        'bob@example.com',
        '+44 7000 222222',
        'https://example.com/images/bob.jpg',
        'false'
      ],
      [
        'Emma',
        'Davis',
        'emma@example.com',
        '+44 7000 333333',
        'https://example.com/images/emma.jpg',
        'true'
      ],
      [
        'Frank',
        'White',
        'frank@example.com',
        '+44 7000 444444',
        'https://example.com/images/frank.jpg',
        'false'
      ],
      [
        'Isabella',
        'Martinez',
        'isabella@example.com',
        '+44 7000 555555',
        'https://example.com/images/isabella.jpg',
        'true'
      ],
      [
        'Rachel',
        'Cummings',
        'rachel@example.com',
        '+44 7000 666666',
        'https://example.com/images/rachel.jpg',
        'false'
      ]
    ])
    })
})

describe('test alterationn functions', () => {
    test('should leave original json data unmutated', () =>{
        alterProperties(propertiesData)
        expect(propertiesData).toEqual([
  {
    "name": "Modern Apartment in City Center",
    "property_type": "Apartment",
    "location": "London, UK",
    "price_per_night": 120.0,
    "description": "Description of Modern Apartment in City Center.",
    "host_name": "Alice Johnson",
    "amenities": ["WiFi", "TV", "Kitchen"]
  },
  {
    "name": "Cosy Family House",
    "property_type": "House",
    "location": "Manchester, UK",
    "price_per_night": 150.0,
    "description": "Description of Cosy Family House.",
    "host_name": "Alice Johnson",
    "amenities": ["WiFi", "Parking", "Kitchen"]
  },
  {
    "name": "Chic Studio Near the Beach",
    "property_type": "Studio",
    "location": "Brighton, UK",
    "price_per_night": 90.0,
    "description": "Description of Chic Studio Near the Beach.",
    "host_name": "Alice Johnson",
    "amenities": ["WiFi"]
  },
  {
    "name": "Elegant City Apartment",
    "property_type": "Apartment",
    "location": "Birmingham, UK",
    "price_per_night": 110.0,
    "description": "Description of Elegant City Apartment.",
    "host_name": "Emma Davis",
    "amenities": ["TV", "Kitchen", "Washer"]
  },
  {
    "name": "Charming Studio Retreat",
    "property_type": "Studio",
    "location": "Bristol, UK",
    "price_per_night": 85.0,
    "description": "Description of Charming Studio Retreat.",
    "host_name": "Emma Davis",
    "amenities": ["WiFi", "TV"]
  },
  {
    "name": "Luxury Penthouse with View",
    "property_type": "Apartment",
    "location": "London, UK",
    "price_per_night": 250.0,
    "description": "Description of Luxury Penthouse with View.",
    "host_name": "Alice Johnson",
    "amenities": ["WiFi", "Parking", "TV"]
  },
  {
    "name": "Spacious Countryside House",
    "property_type": "House",
    "location": "Yorkshire, UK",
    "price_per_night": 200.0,
    "description": "Description of Spacious Countryside House.",
    "host_name": "Isabella Martinez",
    "amenities": ["Washer", "Parking", "Kitchen"]
  },
  {
    "name": "Seaside Studio Getaway",
    "property_type": "Studio",
    "location": "Cornwall, UK",
    "price_per_night": 95.0,
    "description": "Description of Seaside Studio Getaway.",
    "host_name": "Emma Davis",
    "amenities": ["WiFi"]
  },
  {
    "name": "Cosy Loft in the Heart of the City",
    "property_type": "Apartment",
    "location": "Manchester, UK",
    "price_per_night": 130.0,
    "description": "Description of Cosy Loft in the Heart of the City.",
    "host_name": "Isabella Martinez",
    "amenities": ["WiFi", "Kitchen", "TV"]
  },
  {
    "name": "Quaint Cottage in the Hills",
    "property_type": "House",
    "location": "Lake District, UK",
    "price_per_night": 180.0,
    "description": "Description of Quaint Cottage in the Hills.",
    "host_name": "Isabella Martinez",
    "amenities": ["Washer", "Parking", "WiFi"]
  },
  {
    "name": "Bright and Airy Studio",
    "property_type": "Studio",
    "location": "Cambridge, UK",
    "price_per_night": 100.0,
    "description": "Description of Bright and Airy Studio.",
    "host_name": "Alice Johnson",
    "amenities": ["WiFi", "TV"]
  }
])
    })
})
