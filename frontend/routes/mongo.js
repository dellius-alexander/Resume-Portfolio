const mongoose = require('mongoose');

// import environment variables
try {
    ;(function(){
        console.log('Importing server dependencies......');
        const result =  require('../utils/config').config({pathEnv: '../../.env'});
        if (result.error) {
                console.error('Error loading environment variables.')
                console.dir(result)
                process.exit(1)
            }
            console.log('Successfully imported server dependencies......');
            console.dir(result);
    })();
} catch (e) {
    console.error('Error loading environment variables.')
    console.dir(e)
}

const MONGO_USERNAME = process.env.MONGO_INITDB_ROOT_USERNAME || 'resume';
const MONGO_PASSWORD = process.env.MONGO_INITDB_ROOT_PASSWORD || 'portfolio';

console.log(`MONGODB_USERNAME: ${MONGO_USERNAME}`);
console.log(`MONGODB_PASSWORD: ${MONGO_PASSWORD}`);

const MONGO_DATABASE = process.env.MONGO_INITDB_DATABASE || 'resume';
const MONGO_HOST = process.env.MONGO_HOST || '0.0.0.0';
const MONGO_PORT = process.env.MONGO_PORT || 27017;
const MONGO_CONNECTION_STRING = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DATABASE}`;
console.log(`MONGO_CONNECTION_STRING: ${MONGO_CONNECTION_STRING}`);
/**
 * @class MongoDB
 * @description MongoDB class for connecting to MongoDB
 * @param {string} connectionString - MongoDB connection string
 * @param {string} db - MongoDB database name
 * @returns {MongoDB} - MongoDB class
 * @example
 * const mongodb = new MongoDB(connectionString, db);
 * await mongodb.init();
 * await mongodb.health_check();
 * await mongodb.ping_db();
 * await mongodb.close();
 */
class MongoDB {
    constructor(connectionString = MONGO_CONNECTION_STRING, db = MONGO_DATABASE){
        this.connectionString = connectionString;
        this.db = db;
        this.client = null;
    }

    async init(){
        try{
            this.client = await mongoose.connect(this.connectionString);
            console.log("Connected to MongoDB successfully.");
        } catch(err){
            console.error('Error connecting to MongoDB:', err);
            process.exit();
        }
    }

    async health_check(){
        try{
            await this.client.db(this.db).command({ ping: 1 })
                .then((resp) => {
                    console.log('MongoDB health check:', resp);
                });
            return true;
        } catch (err){
            return false;
        }
    }

    async ping_db(){
        try{
            await this.client.db.admin().command({ ping: 1 });
            return true;
        } catch (err){
            return false;
        }
    }

    async get_db(){
        return this.client.databases(this.db);
    }

    async close(){
        try{
            await this.client.disconnect();
        } catch (err){
            console.error('Error while disconnecting from MongoDB:', err);
        }
    }
}

/**
 * @function main
 * @description Main function for testing MongoDB connection
 * @return {Promise<MongoDB>}
 */
async function main() {
    const mongodb = new MongoDB();
    await mongodb.init();

    if(!await mongodb.health_check())
        console.error("Server not available.");
    else if(!await mongodb.ping_db())
        console.error("Could not ping MongoDB.");
    else
        console.log('MongoDB ping successful.');

    return mongodb;
}

main().then((mongoDB) => {
    console.log('MongoDB class:', mongoDB);
    mongoDB.close();
    process.exit();
}).catch(console.dir);
