// src/app.js - Servidor Express

const express = require('express');
const app = express();

app.use(express.json());

// Inventario en memoria
const items = [
  { id: 1, name: 'Laptop', price: 1200, stock: 10 },
  { id: 2, name: 'Mouse',  price: 25,   stock: 50 },
  { id: 3, name: 'Teclado', price: 45,  stock: 30 },
];

// --- ENDPOINTS BASE ---

// GET /health - Estado del servidor
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// GET /items - Lista todos los items del inventario
app.get('/items', (req, res) => {
  res.status(200).json(items);
});

// --- ENDPOINTS EXTENDIDOS ---

// GET /items/:id - Busca un item por su ID
app.get('/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (!item) {
    return res.status(404).json({ error: 'Item no encontrado' });
  }
  res.status(200).json(item);
});

// POST /items - Agrega un nuevo item al inventario
app.post('/items', (req, res) => {
  const { name, price, stock } = req.body;
  if (!name || price === undefined || stock === undefined) {
    return res.status(400).json({ error: 'Faltan campos requeridos: name, price, stock' });
  }
  const newItem = { id: items.length + 1, name, price, stock };
  items.push(newItem);
  res.status(201).json(newItem);
});

module.exports = app;
