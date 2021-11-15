const push = require('web-push');
const fs = require('fs');
const path = './keys/keys.json';

if (!fs.existsSync(path)) {
    // path not exists
    // Genetate Keys only once
    const keys = push.generateVAPIDKeys();
    fs.writeFileSync(path, JSON.stringify(keys));
}

const vapidKeys = JSON.parse(fs.readFileSync(path, "utf8"));
push.setVapidDetails('mailto:test123mail@gmail.com', vapidKeys.publicKey, vapidKeys.privateKey);

const notifySubscribers = (endpoint, message) => {
    push.sendNotification(endpoint, message); 
};

module.exports = { notifySubscribers };
