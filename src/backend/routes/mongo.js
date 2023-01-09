/**
 *    Copyright 2022 Dellius Alexander
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */
// const username = encodeURIComponent("<username>");
// const password = encodeURIComponent("<password>");
// const cluster = "<clusterName>";
// const authSource = "<authSource>";
// const authMechanism = "<authMechanism>";
// // import environment variables
const path = require('path');
// const fs = require('fs')
// const dotenv = require('dotenv')
// const app = require(path.join(process.env.APP_HOME, 'server'))
// try {
//     if (fs.existsSync(path.join(__dirname, '.env'))) {
//         const result = dotenv.config({ // if we have environment file we use it, else default runtime environment
//                 path: path.join(__dirname, ".env"),
//                 encoding: 'utf8',
//                 debug: true,
//                 override: true
//             }
//         )
//         if (result.error) {
//             throw result.error
//         }
//         // else {
//         //     // console.log(result)
//         // }
//     }
// }
// catch (e) {
//     console.error(e)
//     console.error(`Startup will continue, defaulting to runtime environment.`)
// }

const { MongoClient, ServerApiVersion }  = require("mongodb");

/**
 * Establish MongoDB connection
 * @returns {Promise<void>}
 */

    console.log('MongoClient URL: ' + process.env.MONGODB_URI)
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * The connection URI is the set of instructions that the driver uses to connect to a MongoDB deployment.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     * The following example shows each part of the connection URI:
     * ["mongodb://<username>:<password>@<hostname/ip address>:<port>/<connection options>"]
     */
    const uri = `${process.env.MONGODB_URI}`

    /**
     * The Mongo Client you will use to interact with your database
     * See https://mongodb.github.io/node-mongodb-native/3.6/api/MongoClient.html for more details
     * In case: '[MONGODB DRIVER] Warning: Current Server Discovery and Monitoring engine is deprecated...'
     * pass option { useUnifiedTopology: true } to the MongoClient constructor.
     * const client =  new MongoClient(uri, {useUnifiedTopology: true})
     */
    const client = new MongoClient(uri,{useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1});
    // const client = new MongoClient(process.env.MONGODB_URL);
    var _db;
    var _getDB;

        // console.log(`Connection attempt: ${client}`)
        // connect to the MongoDB cluster
         client.connect( async function(err, connection){
             if (err) {
                 console.error(err);
             } else {
                 console.log(`Connection success: ${connection}`);
                 _db = connection.db('messages');
             }
         });
             // .catch(err => {
             //     console.error(`DB Connection error: ${err}`)
             // });


        // app.listen(process.env.PORT, function () {
        //     console.log(`Connected to MongoDB on port ${process.env.PORT}`)
        // })


        // // Establish and verify the connection
        // client
        //     .db("admin0")
        //     .command({ping: 2})
        //     .then(
        //         (value) => {
        //             console.log(`Connection ${value['ok'] === 1 ? "Successful..." : "Error"}`)
        //             return value;
        //         }
        //     )
        //     .catch(err => {
        //         console.error(`Error: ${err}`)
        //     }).finally((value) => {
        //         // verify connection
        //         console.log(value)
        //     })


        // // get a list of databases from callback function
        // if (callback === null){
        //     await listDatabases(client);
        // } else {
        //     console.log(callback);
        // }

/**
 * Get collection from database.
 * @param {MongoClient} client A MongoClient that is connected to a cluster
 * @param db_name the database name
 * @param collection_name the collection name
 * @param callback the callback function
 * @returns {Promise<void>}
 */
async function get_collection(client, db_name, collection_name, callback) {
    try {
        client.connect(err => {
            const collection = client.db(db_name).collection(collection_name);
            if (err) {
                console.error(err)
            } else{
                // perform actions on the collection object
                console.log(collection)
                callback()
            }
        });
    } catch (e) {
        console.error(e);
    }
};

/**
 * Print the names of all available databases
 * @param {MongoClient} client A MongoClient that is connected to a cluster
 * @returns {Promise<void>}
 */
async function listDatabases(client){
    try {
        // get the list of databases
        const databasesList = await client.db().admin().listDatabases();
        // now list the databases
        console.log("Databases:");
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));
    } catch (e) {
        console.error(e);
    }

};

function defaultCallback(err) {
    console.error(err);
}

