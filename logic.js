// lib/logic.js - Lógica de negocio del inventario

const calculateValue = (price, stock) => {
  if (price < 0 || stock < 0) return 0;
  return price * stock;
};

// --- EXTENSIONES ---

// Calcula el valor con descuento aplicado (porcentaje entre 0 y 100)
const calculateDiscountedValue = (price, stock, discountPercent) => {
  if (price < 0 || stock < 0 || discountPercent < 0 || discountPercent > 100) return 0;
  const total = price * stock;
  return total - (total * discountPercent) / 100;
};

// Determina si hay suficiente stock para cubrir una orden
const isStockSufficient = (stock, orderQuantity) => {
  if (stock < 0 || orderQuantity < 0) return false;
  return stock >= orderQuantity;
};

module.exports = { calculateValue, calculateDiscountedValue, isStockSufficient };
