<p align="center">
	<img src="img/pateka.png" width="200px" height="auto"/>
</p>

<h1 align="center">pateka - ordered parallel asynchronous tasks</h1>

<p align="center"><a href="https://travis-ci.com/eCollect/pateka" rel="nofollow"><img src="https://camo.githubusercontent.com/15b2fa131b197201791679d480e8a1739d091eba/68747470733a2f2f7472617669732d63692e636f6d2f65436f6c6c6563742f706174656b612e7376673f6272616e63683d6d6173746572" alt="travis" data-canonical-src="https://travis-ci.com/eCollect/pateka.svg?branch=master" style="max-width:100%;"></a> <a href="https://www.npmjs.com/package/pateka" rel="nofollow"><img src="https://camo.githubusercontent.com/fc6c846dbdf7eb28896b6611cc1ec2278d9b49b1/68747470733a2f2f62616467652e667572792e696f2f6a732f706174656b612e737667" alt="npm version" data-canonical-src="https://badge.fury.io/js/pateka.svg" style="max-width:100%;"></a> <a href="https://coveralls.io/github/eCollect/pateka?branch=master" rel="nofollow"><img src="https://camo.githubusercontent.com/371601014a369cdc5495c8542cdb74703e4828f3/68747470733a2f2f636f766572616c6c732e696f2f7265706f732f6769746875622f65436f6c6c6563742f706174656b612f62616467652e7376673f6272616e63683d6d6173746572" alt="Coverage Status" data-canonical-src="https://coveralls.io/repos/github/eCollect/pateka/badge.svg?branch=master" style="max-width:100%;"></a> <a href="https://snyk.io/test/github/eCollect/pateka?targetFile=package.json" rel="nofollow"><img src="https://camo.githubusercontent.com/e560e08aab5b523c56785ac8d7b5c6fc787c5c93/68747470733a2f2f736e796b2e696f2f746573742f6769746875622f65436f6c6c6563742f706174656b612f62616467652e7376673f74617267657446696c653d7061636b6167652e6a736f6e" alt="Known Vulnerabilities" data-canonical-src="https://snyk.io/test/github/eCollect/pateka/badge.svg?targetFile=package.json" style="max-width:100%;"></a> <a href="/eCollect/pateka/blob/master/LICENSE"><img src="https://camo.githubusercontent.com/1e5d6c593654e3673fe4323032b7af9656157b1e/68747470733a2f2f6261646765732e66726170736f66742e636f6d2f6f732f6d69742f6d69742e7376673f763d313033" alt="MIT Licence" data-canonical-src="https://badges.frapsoft.com/os/mit/mit.svg?v=103" style="max-width:100%;"></a></p>

## Installation

```shell
$ npm install pateka
```

## Usage


Creating a new pateka dispatcher. By default a pateka will be created with 256 tracks, each track than will be filled with async tasks based on their routing key, and be run in order. Tracks will be run in parallel.

```javascript
const Pateka = require('pateka');

const Pateka = new Pateka();
```

### Setting the number of (parallel) tracks

You can chnage the default number of tracks by passing a `tracks` option to the constructor.

```javascript
const Pateka = new Pateka({  tracks: 128 });
```


## Adding tasks

Task are added with the `add` method. You will need to specify an `id` for the task, a `task` function, and a `routingKey`.

The routingKey will be used to spread tasks into tracks, ensuring that tasks with the same key are always run in the right order and sequence.

```javascript
pateka.add({
	routingKey: 'order-1234', // shared between tasks that needs tp be run in sequence
	id: '713973e256ab63505cba325344d30dbb', // unique for this task
	async task () {
		// do some work on this order
	}
});

pateka.add({
  routingKey: 'order-1234', // shared between tasks that needs tp be run in sequence
  id: ' 2cd96bc0d5b0d2e6520ef04fa9f887b9', // unique for this task
  async task () {
		// do some additional work on this order, after the other work has fhinished
	}
});
```

### Awaiting a task to be done

```javascript
await pateka.add({
  routingKey: 'order-1234', // shared between tasks that needs tp be run in sequence
  id: ' 2cd96bc0d5b0d2e6520ef04fa9f887b9', // unique for this task
  async task () {
		// do some additional work on this order, after the other work has fhinished
	}
});
```

## License

Copyright (c) 2018 eCollect AG.
Licensed under the [MIT](LICENSE) license.
