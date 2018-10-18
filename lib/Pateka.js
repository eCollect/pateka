'use strict';

const Track = require('./Track');

const dummyLongTrack = {
	size: Infinity,
};

class Pateka {
	/**
	 * @constructor
	 * @param {Object} options -  Pateka options
	 * @param {Number} [options.tracks=128] - Number of desierd tracks
	 * @param {Number} [options.concurrency=1] - Concurrency level per track
	 */
	constructor({ tracks = 256, concurrency = 1 } = {}) {
		this.tracks = [];

		for (let i = 0; i < tracks; i++)
			this.tracks[i] = new Track({ concurrency });
	}

	/**
	 * @private
	 */
	_findBestTrackForRoutingKey(routingKey) {
		if (!routingKey)
			throw new Error('Routing key is missing.');

		// dummy object to easy length comparing
		let shortestTrack = dummyLongTrack;

		for (const track of this.tracks) {
			// track has alredy pending tasks with the same routing key
			if (track.hasRoutingKey(routingKey))
				return track;

			// store the shortest one in case we didn't any match
			if (track.size < shortestTrack.size)
				shortestTrack = track;
		}

		return shortestTrack;
	}

	/**
	 * @param {Object} task -  Pateka options
	 * @param {String|Number} [task.routingKey] - The key by which the task will be routed
	 * @param {String|Number} [task.id] - The task unqiue identifier
	 * @param {Function} [task.task] - The task itself
	 */
	async add({ routingKey, id, task } = {}) {
		if (!routingKey)
			throw new Error('routingKey is missing.');

		if (!id)
			throw new Error('id is missing.');

		if (!task)
			throw new Error('task is missing.');

		if (typeof task !== 'function')
			throw new Error('task is not a function.');


		const trackForTask = this._findBestTrackForRoutingKey(this.tracks, routingKey);
		const taskIdentity = { routingKey, id };

		trackForTask.add(taskIdentity);
		try {
			await trackForTask.queue.add(task);
		} finally {
			trackForTask.remove(taskIdentity);
		}
	}
}


module.exports = Pateka;
