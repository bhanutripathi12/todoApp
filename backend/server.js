const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const PORT = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();

// Database
let db;
const dbConnectionStr = process.env.DB_STRING;
const dbName = 'todo';

MongoClient.connect(dbConnectionStr, { useUnifiedTopology: true }).then(
  (client) => {
    console.log(`Connected to ${dbName} Database`);
    db = client.db(dbName);
  }
);

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

// Routes
app.get('/', async (request, response) => {
  try {
    const todoItems = await db.collection('todos').find().toArray();
    const itemsLeft = await db.collection('todos').countDocuments({ completed: false });
    response.json({ items: todoItems, left: itemsLeft });
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/addTodo', async (request, response) => {
  try {
    const items = await db.collection('todos').insertOne({
      thing: request.body.todoItem,
      completed: false,
    });
    console.log('Todo Added');
    response.json(items);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'An error occurred' });
  }
});

app.delete('/deleteItem', async (request, response) => {
  try {
    const item = await db.collection('todos').deleteOne({ thing: request.body.todoItem });
    console.log('Item Deleted');
    response.json(item);
  } catch (error) {
    console.error(error);
    response.status(500).json({ error: 'An error occurred' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
