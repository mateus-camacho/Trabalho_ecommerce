const express = require('express');
const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public')); // Servindo arquivos estáticos

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
