# node-lxd-client

```JavaScript
const { LXD } = require('node-lxd-client');
const fs = require('fs');
const path = require('path');

const lxd = new LXD({
    host: 'https://my-private-lxd-server:8443',
    cert: fs.readFileSync(path.resolve(__dirname, '../../.config/lxc/client.crt')),
    key: fs.readFileSync(path.resolve(__dirname, '../../.config/lxc/client.key')),
    password: 'mypassword'
});


lxd.authorizeCertificate()
   .then(data => lxd.image.all())
   .then(data => {
       console.log(data);
   })
   .catch(data => {
       console.error(data);
   });

```