const config = require('config');
const mongoose = require('mongoose');

class MongoHelper {

  async connect() {
    try {
      await mongoose.connect(config.dbConnString, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
      });
    }
    catch (err) {
      console.log("XXX Database connection Error");
    }
  }

  async dropCollections(...collections) {
    console.log('XXX collection', collections);
    collections.forEach(async function (collection) {
      try {
        await mongoose.connection.db.dropCollection(collection);
      }
      catch (err) {
        console.log(`XXX collection '${collection}' doesn't exist...`);
      }
    });
    console.log("XXX collections dropped...");
  }

  async close() {
    await mongoose.connection.close();
  }
}

mongo = new MongoHelper();
module.exports = mongo;