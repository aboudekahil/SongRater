/**
 * This file is used for configuring all the endpoints in the project, as well
 * as separating the post requests to an /api/ endpoint.
 */


// Requires + defining the router
// ----------------------------------------------------------------------------
const express = require('express');
const home = require('../routes/home.route');
const fs = require('fs');
const path = require('path');

const router = express.Router();


// Read all the routes in the routes folder
// ----------------------------------------------------------------------------
const routesDirPath = path.dirname(__dirname);
const routesDir = fs.readdirSync(path.join(routesDirPath, 'routes'));


// Package all the routes into one router
// ----------------------------------------------------------------------------
for (const routeFile of routesDir) {
  let route = require(path.join(routesDirPath, 'routes', routeFile));

  for (const routeProperties of route.stack) {
    let path = routeProperties.route.path.slice(1); // remove the `/` at the beginning of the path
    let controller = routeProperties.route.stack[0].handle;
    let method = routeProperties.route.stack[0].method; // get or post

    if (method === 'post') {
      router.post(`/api/${path}`, controller);
    } else {
      // method === get
      router.get(`/${path}`, controller);
    }
  }
}

// exporting
module.exports = router;
