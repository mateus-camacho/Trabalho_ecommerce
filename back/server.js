const express = require('express');
const { MongoClient } = require("mongodb");
const cors = require('cors'); 
const app = express();
const PORT = process.env.PORT || 3001;

const uri = "mongodb+srv://seilatrabalhonosql:nosql@ecommerce.p6fkt.mongodb.net/";
const client = new MongoClient(uri);
app.use(cors());

app.get('/', async (req, res) => {
  try {
    await client.connect();
    const database = client.db("ecommerce");
    const collection = database.collection("video_games");
    const products = await collection.find({}).toArray();
    res.json(products);
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    res.status(500).json({ error: "Erro ao buscar produtos" });
  } finally {
    await client.close();
  }
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
