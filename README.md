# ssp-io-agent

This module is used by [PM2](https://github.com/Unitech/ssp) to communicate with [PM2.io](https://ssp.io/plus)'s servers.

## Transporters

Two transporters are available now, AxonTransporter and WebsocketTransporter.

AxonTransporter is using [axon pub-emitter](https://github.com/tj/axon) to send data (PushInteractor) to interaction server and [nssocket](https://github.com/foreverjs/nssocket) to receive data from reverse interaction server.

WebsocketTransporter is using [websocket](https://github.com/websockets/ws) to send and receive data from websocket server.

## Launch

### Using daemon

To launch using daemon you need to run :

`node src/InteractorDaemon.js`


Before, you need to set these environment vars

| Key              | Value                                     |
|------------------|-------------------------------------------|
| KEYMETRICS_NODE  | Where bucket's endpoints will be resolved |
| PM2_SECRET_KEY   | Bucket's secret key                       |
| PM2_PUBLIC_KEY   | Bucket's public key                       |
| PM2_MACHINE_NAME | Machine name                              |
| PM2_VERSION      | PM2 Version                               |

### Using client

You can use `src/InteractorClient.js` and method `launchAndInteract` with constants as first argument (empty object is authorized), options as second argument which is an object with key `secret_key`, `public_key`, `machine_name` and callback as third argument.

```js
const InteractorClient = require('keymetrics-agent/src/InteractorClient')

InteractorClient.launchAndInteract({}, {
  secret_key: '',
  public_key: '',
  machine_name: ''
}, (err, msg) => {
})
```

## Configuration

To configure this agent you can use `config.json`. 

### Default

By default `AxonTransporter` is enabled and using `push` and `reverse` bucket's endpoint. 
You can override this endpoints with `AGENT_PUSH_ENDPOINT` and `AGENT_REVERSE_ENDPOINT` environements' vars

By default `WebsocketTransporter` is disabled, you can enabled it with `AGENT_TRANSPORT_WEBSOCKET` environement's var, it's using `websocket` bucket's endpoint but you can override it with `AGENT_WEBSOCKET_ENDPOINT` environement's var.

### Transporters

Into this configuration you can put `transporter name` as key and for values, two keys are available `enabled` and `endpoints`. 

The `enabled` key is using to disable or enable transporter.

The `endpoints` key can be a string or an object. It depends on what the connect method of the transporter needs. 
If you set a string, the connect method will be called with endpoint's value or raw value if no endpoint is matched.
For objects, the connect method will be called with this object, and value of the keys will be replaced by endpoint's value or raw value if no endpoint is matched.

## Release

To release a new version, first install [gren](https://github.com/github-tools/github-release-notes) :
```bash
yarn global add github-release-notes
```

Push a commit in github with the new version you want to release : 
```
git commit -am "version: major|minor|patch bump to X.X.X"
```

Care for the **versionning**, we use the [semver versioning](https://semver.org/) currently. Please be careful about the version when pushing a new package.

Then tag a version with git : 
```bash
git tag -s vX.X.X
```

Push the tag into github (this will trigger the publish to npm) : 
```
git push origin vX.X.X
```

To finish update the changelog of the release on github with `gren` (be sure that gren has selected the right tags):
```
gren release -o -D commits -u keymetrics -r ssp-io-agent
```