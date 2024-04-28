const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;


//middleware
app.use(cors());
app.use(express.json());
//-----------------------
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qvjjrvn.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const craftsCollection = client.db("CraftsCollection").collection("Crafts");
    const artCraftsCollection = client.db("CraftsCollection").collection("ArtCollection");

    //all crafts api
    app.get('/crafts', async (req, res) => {
      const cursor = craftsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    //single craft api 
    app.get('/crafts/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const result = await craftsCollection.findOne(filter);
      res.send(result);
    });
    // crafts create api
    app.post('/crafts', async (req, res) => {
      const craft = req.body;
      const result = await craftsCollection.insertOne(craft);
      res.send(result);
    });
    //craft delete api
    app.delete('/crafts/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await craftsCollection.deleteOne(filter);
      res.send(result);
    });
    //craft update api
    app.put('/crafts/:id', async (req, res) => {
      const craft = req.body;
      console.log(craft);
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateCraft = {
        $set: {
          name: craft.name,
          subCategory: craft.subCategory,
          description: craft.description,
          price: craft.price,
          process: craft.process,
          stock: craft.stock,
          userName: craft.userName,
          userEmail: craft.userEmail,
          yes: craft.yes,
          no: craft.no,
          photo: craft.photo,
        }
      }
      const result = await craftsCollection.updateOne(filter, updateCraft, options);
      res.send(result);
    });
    //my cart api
    app.get('/myCrafts/:email', async (req, res) => {
      console.log({userEmail : req.params.email});
      const filter = {userEmail : req.params.email}
      const cursor = craftsCollection.find(filter);
      // console.log(cursor);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get('/artCrafts', async(req, res) => {
      const result = await artCraftsCollection.find().toArray();
      console.log(result);
      res.send(result);
    })
    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//------------------------

app.get('/', (req, res) => {
  res.send('Art & Crafts data');
});

app.listen(port, () => {
  console.log('server is running on ', port);
})