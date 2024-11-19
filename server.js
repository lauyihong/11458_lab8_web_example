const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb+srv://archevanliu:lab7lab7@clusterlab7.1zwds.mongodb.net/MTA?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Define schema for GeoJSON data
const geoSchema = new mongoose.Schema({
  type: { type: String, default: "Feature" },
  properties: {
    name: String,
    url: String,
    line: String,
    objectid: String,
    notes: String
  },
  geometry: {
    type: { type: String, enum: ['Point', 'LineString', 'Polygon'], required: true },
    coordinates: { type: [Number], required: true }
  }
}, { collection: 'Stations' }); // 指定集合名称为 'Stations'

// Define the model with the specified schema
const GeoModel = mongoose.model('GeoModel', geoSchema);

const bodyParser = require('body-parser');

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const formSchema = new mongoose.Schema({
  name: { type: String, required: true },  // 必填
  lon: { type: Number, required: true },  // 经度
  lat: { type: Number, required: true },  // 纬度
  notes: { type: String }                 // 可选备注
});

const FormData = mongoose.model('FormData', formSchema);

app.get('/form', (req, res) => {
  res.sendFile(__dirname + '/form.html');
});

app.post('/submit', async (req, res) => {
  const formData = new FormData({
      name: req.body.name,
      lon: req.body.lon,
      lat: req.body.lat,
      notes: req.body.notes || '' // 若未填写备注，存储为空字符串
  });

  try {
      await formData.save();
      res.send('Location data saved to MongoDB!');
  } catch (err) {
      res.status(500).send('Error saving data');
  }
});


// API endpoint to get all GeoJSON data
app.get('/api/geojson', async (req, res) => {
  try {
    const features = await GeoModel.find();
    res.json({
      type: "FeatureCollection",
      features: features
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
