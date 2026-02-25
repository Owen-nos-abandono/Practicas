// tests/app.test.js

const request = require('supertest');
const app = require('../src/app');
const { calculateValue, calculateDiscountedValue, isStockSufficient } = require('../src/logic');

describe('Suite de Pruebas de Calidad de Software', () => {

  // =========================================================
  //  PRUEBAS UNITARIAS - Lógica de Inventario
  // =========================================================
  describe('Pruebas Unitarias - Lógica de Inventario', () => {

    // --- Tests base ---
    test('Debe calcular correctamente el valor total (10 * 5 = 50)', () => {
      const result = calculateValue(10, 5);
      expect(result).toBe(50);
    });

    test('Debe retornar 0 si se ingresan valores negativos', () => {
      const result = calculateValue(-10, 5);
      expect(result).toBe(0);
    });

    // --- Tests extendidos ---

    // EXTENSIÓN 1: Validar lógica de descuento
    test('[EXT] calculateDiscountedValue - Debe aplicar correctamente un descuento del 20%', () => {
      // precio=100, stock=3 → total=300, descuento 20% → 240
      const result = calculateDiscountedValue(100, 3, 20);
      expect(result).toBe(240);
    });

    test('[EXT] calculateDiscountedValue - Debe retornar 0 si el descuento es mayor al 100%', () => {
      const result = calculateDiscountedValue(100, 5, 110);
      expect(result).toBe(0);
    });

    // EXTENSIÓN 2: Validar suficiencia de stock
    test('[EXT] isStockSufficient - Debe retornar true cuando el stock cubre la orden', () => {
      expect(isStockSufficient(10, 5)).toBe(true);
    });

    test('[EXT] isStockSufficient - Debe retornar false cuando el stock es insuficiente', () => {
      expect(isStockSufficient(3, 10)).toBe(false);
    });

  });

  // =========================================================
  //  PRUEBAS DE INTEGRACIÓN - API Endpoints
  // =========================================================
  describe('Pruebas de Integración - API Endpoints', () => {

    // --- Tests base ---
    test('GET /health - Debe responder con status 200 y JSON correcto', async () => {
      const response = await request(app).get('/health');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('status', 'OK');
    });

    test('GET /items - Debe validar la estructura del inventario', async () => {
      const response = await request(app).get('/items');
      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('stock');
    });

    // --- Tests extendidos ---

    // EXTENSIÓN 3: GET /items/:id - item existente y no existente
    test('[EXT] GET /items/:id - Debe retornar el item correcto cuando el ID existe', async () => {
      const response = await request(app).get('/items/1');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
      expect(response.body).toHaveProperty('name', 'Laptop');
    });

    test('[EXT] GET /items/:id - Debe retornar 404 cuando el ID no existe', async () => {
      const response = await request(app).get('/items/9999');
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('error');
    });

    // EXTENSIÓN 4: POST /items - creación exitosa y validación de campos
    test('[EXT] POST /items - Debe crear un nuevo item y retornar status 201', async () => {
      const nuevoItem = { name: 'Monitor', price: 300, stock: 15 };
      const response = await request(app).post('/items').send(nuevoItem);
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', 'Monitor');
    });

    test('[EXT] POST /items - Debe retornar 400 si faltan campos requeridos', async () => {
      const itemIncompleto = { name: 'Audífonos' }; // falta price y stock
      const response = await request(app).post('/items').send(itemIncompleto);
      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

  });

});
