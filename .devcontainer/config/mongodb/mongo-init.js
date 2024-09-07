#!/usr/bin/env node
// create admin user
// db.getSiblingDB('admin').auth(
//     'resume',
//     'portfolio');
// create user
db.getSiblingDB('resume').createUser({
    user: 'resume',
    pwd: 'portfolio',
    roles: [
        {
            role: 'dbOwner',
            db: 'resume'
        },
        {
            role: 'readWrite',
            db: 'resume'
        },
        {
            role: 'userAdminAnyDatabase'
        }
    ]
});

// users collection
db.createCollection("users", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["name", "email", "password", "age"],
            properties: {
                _id: {
                    bsonType: "objectId",
                    description: "must be an objectId and is required",
                    uniqueItems: true,
                    default: new ObjectId()
                },
                name: {
                    bsonType: "string",
                    description: "required and must be a string"
                },
                email: {
                    bsonType: "string",
                    description: "required and must be a string representing an email address",
                    pattern: "^\\S+@\\S+\\.\\S+$",
                    uniqueItems: true
                },
                password: {
                    bsonType: "string",
                    description: "required and must be a string"
                },
                age: {
                    bsonType: "int",
                    description: "required and must be an integer"
                },
                roles: {
                    bsonType: "array",
                    description: "must be an array of strings",
                    items: {
                        bsonType: "string"
                    },
                    default: ["user"]
                },
                last_updated: {
                    bsonType: "date",
                    description: "must be a date string in the format YYYY-MM-DD HH:MM:SS",
                    default: new Date()
                }
            }
        }
    }
})
// posts collection
db.createCollection("posts", {
    validator: {
        $jsonSchema: {
            bsonType: "object",
            required: ["title", "body", "author"],
            properties: {
                _id: {
                    bsonType: "objectId",
                    description: "must be an objectId and is required",
                    uniqueItems: true,
                    default: new ObjectId()
                },
                title: {
                    bsonType: "string",
                    description: "required and must be a string"
                },
                body: {
                    bsonType: "string",
                    description: "required and must be a string"
                },
                author: {
                    bsonType: "objectId",
                    description: "must be a reference to a user object",
                    uniqueItems: true
                }
            }
        }
    }
});


