[![travis](https://travis-ci.com/eCollect/pateka.svg?branch=master)](https://travis-ci.com/eCollect/pateka) [![npm version](https://badge.fury.io/js/pateka.svg)](https://www.npmjs.com/package/pateka) [![Coverage Status](https://coveralls.io/repos/github/eCollect/pateka/badge.svg?branch=master)](https://coveralls.io/github/eCollect/pateka?branch=master) [![Known Vulnerabilities](https://snyk.io/test/github/eCollect/pateka/badge.svg?targetFile=package.json)](https://snyk.io/test/github/eCollect/pateka?targetFile=package.json) [![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](LICENSE)

# pateka

Ordered parallel asynchronous tasks.


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
