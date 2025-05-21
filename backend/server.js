const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Ingredient = require(path.join(__dirname, 'models', 'ingredient'));
const Product    = require(path.join(__dirname, 'models', 'product'));

app.post('/products', async (req, res) => {
  try {
    const { name, price, stock, status, ingredients } = req.body;
   const entries = await Promise.all(ingredients.map(async ent => {
      let ingId = ent.ingredient;
      if (!ingId) {
        const newIng = new Ingredient({
          name: ent.ingredientName,
          unit: ent.unit,
          cost: 0,
          stock: 0
        });
        await newIng.save();
        ingId = newIng._id;
      }
      return {
        ingredient: ingId,
        unit: ent.unit,
        amount: Number(ent.amount)
      };
    }));

    const prod = new Product({ name, price, stock, status, ingredients: entries });
    await prod.save();
    await Promise.all(entries.map(e =>
      Ingredient.findByIdAndUpdate(
        e.ingredient,
        { $inc: { stock: -(e.amount * Number(stock)) } },
        { new: true }
      )
    ));

    await prod.populate('ingredients.ingredient');
    res.status(201).json(prod);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Falha ao criar produto e atualizar estoque' });
  }
});

app.get('/products', async (req, res) => {
  const prods = await Product.find().populate('ingredients.ingredient');
  res.json(prods);
});


app.put('/products/:id', async (req, res) => {
  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
});

app.delete('/products/:id', async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.status(204).end();
});


// c
app.post('/ingredients', async (req, res) => {
  const ing = new Ingredient(req.body);
  await ing.save();
  res.status(201).json(ing);
});
// r
app.get('/ingredients', async (req, res) => {
  const items = await Ingredient.find();
  res.json(items);
});
// u
app.put('/ingredients/:id', async (req, res) => {
  const ing = await Ingredient.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(ing);
});
// d
app.delete('/ingredients/:id', async (req, res) => {
  await Ingredient.findByIdAndDelete(req.params.id);
  res.status(204).end();
});
app.listen(3000, () => console.log('Ok'));


