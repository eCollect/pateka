'use strict';

const PQueue = require('p-queue');

class Track {
	constructor({ concurrency = 1 } = {}) {
		this.size = 0;
		this.routingKeys = {};
		this.ids = {};
		this.queue = new PQueue({ concurrency });
	}

	hasRoutingKey(routingKey) {
		return this.routingKeys[routingKey];
	}

	add({ id, routingKey }) {
		this.ids[id] = true;
		this.routingKeys[routingKey] = this.routingKeys[routingKey] ? this.routingKeys[routingKey] + 1 : 1;
		this.size += 1;
		return this;
	}

	remove({ id, routingKey }) {
		delete this.ids[id];
		this.routingKeys[routingKey] -= 1;
		if (!this.routingKeys[routingKey])
			delete this.routingKeys[routingKey];
		this.size -= 1;
		return this;
	}
}

module.exports = Track;
