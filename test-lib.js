const { LXD } = require('./lib/');
const fs = require('fs');
const path = require('path');

const lxd = new LXD({
    host: 'https://repo.emea.roche.com:8443',
    cert: fs.readFileSync(path.resolve(__dirname, '../../.config/lxc/client.crt')),
    key: fs.readFileSync(path.resolve(__dirname, '../../.config/lxc/client.key')),
    password: 'unsecret'
});


lxd.authorizeCertificate()
    .then(data => lxd.image.all())
    .then(data => {
        console.log(data);
    })
    .catch(data => {
        console.error(data);
    });
