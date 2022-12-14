// Requires
// ----------------------------------------------------------------------------
require('dotenv').config(); // process env configure
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const cookies = require('cookie-parser');
const cron = require('node-cron');
const logger = require('./config/logger.config');
const routings = require('./config/routers.config');
const sanitizeImages = require('./utils/sanitizeImages.util');

// App
// ----------------------------------------------------------------------------
const app = express();

// Database init
// ----------------------------------------------------------------------------
mongoose.set('strictQuery', true);
mongoose
  .connect(process.env.MONGODB_URL, {
    connectTimeoutMS: 1000,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log('Connected to Song Rater database');
  })
  .catch((error) => {
    logger.error(`${__filename} -`, error);
    console.log('failed to connect to database');
  });

// Express app + middlewares
// ----------------------------------------------------------------------------

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(cookies());
app.use('/', routings);

// Start server
// ----------------------------------------------------------------------------
app.listen(process.env.PORT || 5000);
console.log(`Listening on http://localhost:${process.env.PORT}`);

// Host static files
// ----------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, 'public')));

// Clean images
// ----------------------------------------------------------------------------
(async () => await sanitizeImages())();
cron.schedule('* * 23 * *', sanitizeImages);

// 404 Page Not Found
// ----------------------------------------------------------------------------
app.use((req, res, next) => {
  res.status(404).render('Error', { status: 404, message: 'Page Not Found' });
});
