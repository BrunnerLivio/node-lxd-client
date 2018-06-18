const { LXDRemoteClient } = require('./lib/');
const fs = require('fs');
const path = require('path');

const lxcRemoteClient = new LXDRemoteClient({
    host: 'https://repo.emea.roche.com:8443',
    cert: fs.readFileSync(path.resolve(__dirname, '../../.config/lxc/client.crt')),
    key: fs.readFileSync(path.resolve(__dirname, '../../.config/lxc/client.key')),
    password: 'unsecret'
});


lxcRemoteClient.authorizeCertificate()
    .then(() => lxcRemoteClient.image.all())
    .then(data => {
        data.forEach(asdf => asdf);
        console.log(JSON.stringify(data, null, 2));
    })
    .catch(data => {
        console.error(data);
    });
