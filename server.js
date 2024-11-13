const express = require('express');
const { MongoClient } = require("mongodb"); // Use MongoClient em vez de MongoProduto
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

async function run() {
  const uri = "mongodb+srv://seilatrabalhonosql:nosql@ecommerce.p6fkt.mongodb.net/";

  // Criando uma instância do MongoClient para conectar ao MongoDB
  const client = new MongoClient(uri);

  try {
    // Conectando ao MongoDB
    await client.connect();
    console.log("Conectado ao MongoDB");

    // Selecionando o banco de dados e a coleção
    const dbName = "ecommerce";
    const collectionName = "video_games";
    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    // Consultando documentos na coleção
    const findQuery = { title: 'Nintendo Switch Sports (Nintendo Switch) (European Version)' };
    const cursor = await collection.find(findQuery).sort({ main_category:1});

    // Iterando pelos documentos encontrados
    await cursor.forEach(video_game => {
      console.log(`${video_game.title} custa ${video_game.price} com nota ${video_game.average_rating}`);
    });
  } catch (err) {
    console.error(`Erro ao buscar documentos: ${err}`);
  } finally {
    // Fechando a conexão
    await client.close();
  }
}

// Chamando a função run para executar o código de consulta
run().catch(console.error);
