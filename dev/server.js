'use strict';

/**
 * dev server for shared state demo
 * Check out the README.md for getting up-to-speed
 */


const MODULE_NAME = 'prototype';
const PRODUCTION = 'production';
const DEV = 'development';
const PORT = 8088;

// core and third party
const express = require("express");
const app = express();
const path = require("path");

const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : DEV;

// -- server-side page templates
app.set("views", path.join(__dirname, './views'));
app.set("view engine", "ejs");

// map static file directories for assets, js, and css
const cacheTime = 86400000 * 7; // 7-days
express.static.mime.define({'application/x-javascript': ['js']});

app.use("/dist", express.static(path.join(__dirname,"../dist")));
app.use("/data", express.static(path.join(__dirname,"./data")));
app.use("/js", express.static(path.join(__dirname,"./js")));

// -- server-side page templates
app.set("views", path.join(__dirname, './server/views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

const pageTitle = 'Calculator & Configurator Integraton DEMO';

const injections = [
   "<script>",
   "window.tesla=" + JSON.stringify({
        env: {
            terms_service_endpoint: '/data/mock_terms_service_response_us_m3.json',
            translations: '/data/translations.json',
            m3_lexicon_endpoint: '/data/lexicon_marketing_response_us_m3.json'
        }, 
       registry: {requiredModules:['Configurator', 'Calculator']}
    })+";",
   "</script>"
].join('\n');

const scripts = {
	registry: "/dist/js/registry.bundle.js",
	configurator: "/dist/js/configurator.bundle.min.js",
    calculator:  "/dist/js/calculator.bundle.js",
}

app.get("/", (req, res) =>{
    res.render("index.ejs", {
      scripts,
      injections,
      pageTitle: pageTitle,
      env: NODE_ENV
    });	
});


/**
 * Run Server
 * Uses custom port
 */
var server = app.listen(PORT, function(){
    console.log('Configurator server up: http://%s:%s', server.address().address, server.address().port);
});

