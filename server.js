const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public')); // Servindo arquivos estáticos

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

const { MongoProduto } = require("mongodb");

async function run() {
  // TODO:
  // Replace the placeholder connection string below with your
  // Altas cluster specifics. Be sure it includes
  // a valid username and password! Note that in a production environment,
  // you do not want to store your password in plain-text here.
  const uri =
    "mongodb+srv://seilatrabalhonosql:nosql@ecommerce.p6fkt.mongodb.net/";

  // The MongoProduto is the object that references the connection to our
  // datastore (Atlas, for example)
  const produto = new MongoProduto(uri);

  // The connect() method does not attempt a connection; instead it instructs
  // the driver to connect using the settings provided when a connection
  // is required.
  await produto.connect();

  // Provide the name of the database and collection you want to use.
  // If the database and/or collection do not exist, the driver and Atlas
  // will create them automatically when you first write data.
  const dbName = "ecommerce";
  const collectionName = "video_games";

  // Create references to the database and collection in order to run
  // operations on them.
  const database = produto.db(dbName);
  const collection = database.collection(collectionName);

  /*
   * *** FIND DOCUMENTS ***
   *
   * Now that we have data in Atlas, we can read it. To retrieve all of
   * the data in a collection, we call Find() with an empty filter.
   * The Builders class is very helpful when building complex
   * filters, and is used here to show its most basic use.
   */

  const findQuery = { main_category: 'Video Games'};

  try {
    const cursor = await collection.find(findQuery).sort({ name: 1 });
    await cursor.forEach(video_game => {
      console.log(`${video_game.title} custa ${video_game.price} com nota ${video_game.average_rating}`);
    });
    // add a linebreak
    console.log();
  } catch (err) {
    console.error(`Something went wrong trying to find the documents: ${err}\n`);
  }


}