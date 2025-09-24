const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// In-memory storage
let products = [
  {
    id: 1,
    name: "Handmade Ceramic Vase",
    description: "Beautiful blue ceramic vase perfect for home decoration",
    price: 45.99,
    category: "Ceramics",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop",
    dateAdded: new Date().toISOString()
  },
  {
    id: 2,
    name: "Wooden Jewelry Box",
    description: "Handcrafted wooden jewelry box with intricate carvings",
    price: 89.99,
    category: "Woodwork",
    image: "https://images.unsplash.com/photo-1544441892-794166f1e3be?w=300&h=300&fit=crop",
    dateAdded: new Date().toISOString()
  },
  {
    id: 3,
    name: "Knitted Wool Scarf",
    description: "Soft and warm hand-knitted wool scarf in multiple colors",
    price: 29.99,
    category: "Textiles",
    image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=300&h=300&fit=crop",
    dateAdded: new Date().toISOString()
  }
];

let nextId = 4;

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Get all products
app.get('/api/products', (req, res) => {
  res.json(products);
});

// Get product by ID
app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// Search products
app.get('/api/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json(products);
  
  const filtered = products.filter(product => 
    product.name.toLowerCase().includes(q.toLowerCase()) ||
    product.description.toLowerCase().includes(q.toLowerCase()) ||
    product.category.toLowerCase().includes(q.toLowerCase())
  );
  res.json(filtered);
});

// Add new product
app.post('/api/products', (req, res) => {
  const { name, description, price, category, image } = req.body;
  
  if (!name || !description || !price || !category) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  const newProduct = {
    id: nextId++,
    name,
    description,
    price: parseFloat(price),
    category,
    image: image || 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=300&h=300&fit=crop',
    dateAdded: new Date().toISOString()
  };
  
  products.push(newProduct);
  res.status(201).json(newProduct);
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  const { name, description, price, category, image } = req.body;
  
  products[productIndex] = {
    ...products[productIndex],
    name: name || products[productIndex].name,
    description: description || products[productIndex].description,
    price: price ? parseFloat(price) : products[productIndex].price,
    category: category || products[productIndex].category,
    image: image || products[productIndex].image
  };
  
  res.json(products[productIndex]);
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);
  
  if (productIndex === -1) {
    return res.status(404).json({ error: 'Product not found' });
  }
  
  products.splice(productIndex, 1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`🎨 Art & Craft Sale server running on http://localhost:${PORT}`);
});
