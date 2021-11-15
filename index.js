'use strict';
const dotenv = require('dotenv');
const express = require('express');
const path = require('path');
const { notifySubscribers } = require('./web-push');
const { db } = require('./database/database');
const subscriberTable = require('./database/subscriberTable');
const subscriber = new subscriberTable(db);
const Response = require('./models/response-model');

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/', express.static(path.join(__dirname, 'client')));

app.post('/subscribe', async (req, res) => {
    const endpoint = req.body.endpoint;
    let response;

    if (!endpoint) {
        response = new Response(400, "No endpoint data");
        res.status(400);
    } else {
        try {
            await subscriber.insertData(endpoint);
            res.status(200);
            response = new Response(200, "Success");
        } catch (e) {
            res.status(500);
            response = new Response(200, "Error while inserting data", e);
        }
    }
    res.send(response);
});

app.post('/sendNotification', async (req, res) => {
    let response;
    try {
        const result = await subscriber.all();
        result.map((row) => {
            notifySubscribers(JSON.parse(row.endpoint), "Message from server!");
        });
        res.status(200);
        response = new Response(200, "Success");
    } catch (e) {
        console.log(e);
        res.status(500);
        response = new Response(500, "Server error!", e);
    }
    res.send(response);
});

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
});