const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const saveRoute = require('./save.js');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use('/api/save-main', saveRoute);

app.listen(1414, () => {
  console.log('✅ GitHub backend running on http://localhost:1414');
});
