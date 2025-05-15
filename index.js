// Importa Express
const express = require('express');

// Crea una instancia de la aplicación Express
const app = express();
const port = 3000; // Puerto en el que se ejecutará la aplicación

// Define una ruta básica
app.get('/', (req, res) => {
  res.send('¡Hola, mundo desde Express!');
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`Servidor Express corriendo en http://localhost:${port}`);
});
