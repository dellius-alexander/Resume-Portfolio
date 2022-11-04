
const dotenv = require('dotenv')
const result = dotenv.config({ path: 'example.env', encoding: 'utf8', debug: true, override: true })

if (result.error) {
    throw result.error
}

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWD}@${process.env.CLUSTER_NAME}/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const username = encodeURIComponent("<username>");
// const password = encodeURIComponent("<password>");
// const cluster = "<clusterName>";
// const authSource = "<authSource>";
// const authMechanism = "<authMechanism>";
//
// let uri = `mongodb+srv://${username}:${password}@${cluster}/?authSource=${authSource}&authMechanism=${authMechanism}`;
// // const uri = `mongodb+srv://admin0:<password>@cluster0.0adpmk2.mongodb.net/?retryWrites=true&w=majority`;
// // const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// const client = new MongoClient(uri);
//
// async function run() {
//     try {
//         await client.connect();
//
//         const database = client.db("<dbName>");
//         const ratings = database.collection("<collName>");
//
//         const cursor = ratings.find();
//
//         await cursor.forEach(doc => console.dir(doc));
//     } finally {
//         await client.close();
//     }
// }
// run().catch(console.dir);



