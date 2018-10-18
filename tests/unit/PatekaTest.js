'use strict';

/* eslint-env node, mocha */

const assert = require('assert');
const { should: shouldFn } = require('chai');
const delay = require('delay');

const Pateka = require('../../lib/Pateka');
const Track = require('../../lib/Track');

shouldFn();

// const neverEndingTask = () => new Promise();

describe('Pateka', () => {
	it('should have the right interface', () => {
		const pateka = new Pateka();
		pateka.add.should.be.a('function');
	});

	it('should throw with missing options', () => {
		const pateka = new Pateka();
		assert.rejects(() => pateka.add()); // all
		assert.rejects(() => pateka.add({ routingKey: '2' })); // id
		assert.rejects(() => pateka.add({ routingKey: '2', id: 'order-123' })); // task
		assert.rejects(() => pateka.add({ routingKey: '2', id: 'order-123', task: 'not a function' })); // task is not a function
	});

	it('should initilize with defualt options', () => {
		const pateka = new Pateka();
		pateka.tracks.length.should.equal(256);
		pateka.tracks.forEach(track => track.queue._concurrency.should.equal(1));
	});

	it('should accept the right options', () => {
		const pateka = new Pateka({ tracks: 12, concurrency: 5 });
		pateka.tracks.length.should.equal(12);
		pateka.tracks.forEach(track => track.queue._concurrency.should.equal(5));
	});

	describe('_findBestTrackForRoutingKey', () => {
		let pateka;
		beforeEach(() => {
			pateka = new Pateka();
		});

		it('should throw for missing routingKey', () => {
			assert.throws(() => pateka._findBestTrackForRoutingKey());
		});

		it('should return first empty track when empty', () => {
			pateka.tracks = [
				new Track(),
				new Track(),
			];
			const track = pateka._findBestTrackForRoutingKey(1);
			track.should.be.equal(pateka.tracks[0]);
		});

		it('should return track with same routingkey when exsiting', () => {
			pateka.tracks = [
				new Track(),
				new Track().add({ id: 15, routingKey: 157 }),
			];
			const track = pateka._findBestTrackForRoutingKey(157);
			track.should.be.equal(pateka.tracks[1]);
		});

		it('should return empty track in case no routing was macthed', () => {
			pateka.tracks = [
				new Track().add({ id: 15, routingKey: 158 }),
				new Track().add({ id: 15, routingKey: 157 }),
				new Track(),
			];
			const track = pateka._findBestTrackForRoutingKey(159);
			track.should.be.equal(pateka.tracks[2]);
		});

		it('should return shotest track in case no routing was macthed', () => {
			pateka.tracks = [
				new Track()
					.add({ id: 15, routingKey: 1 })
					.add({ id: 16, routingKey: 1 })
					.add({ id: 17, routingKey: 1 })
					.add({ id: 18, routingKey: 1 }),
				new Track()
					.add({ id: 21, routingKey: 2 })
					.add({ id: 22, routingKey: 2 })
					.add({ id: 23, routingKey: 2 }),
				new Track()
					.add({ id: 31, routingKey: 3 })
					.add({ id: 32, routingKey: 3 })
					.add({ id: 33, routingKey: 3 })
					.add({ id: 34, routingKey: 3 }),
			];
			const track = pateka._findBestTrackForRoutingKey(159);
			track.should.be.equal(pateka.tracks[1]);
		});
	});


	describe('add', () => {
		let pateka;
		beforeEach(() => {
			pateka = new Pateka();
		});

		it('should run a task', async () => {
			const order = [];
			await pateka.add({
				routingKey: 1,
				id: 1,
				async task() {
					await delay(100);
					order.push(1);
				},
			});
			order.length.should.equal(1);
		});

		it('should run tasks with same routingKey one after another', async () => {
			const order = [];
			await Promise.all([
				pateka.add({
					routingKey: 1,
					id: 1,
					async task() {
						await delay(200);
						order.push(1);
					},
				}),
				pateka.add({
					routingKey: 1,
					id: 2,
					async task() {
						await delay(50);
						order.push(2);
					},
				}),
			]);
			order.length.should.equal(2);
			order[0].should.equal(2);
			order[1].should.equal(1);
		});

		it('should run tasks with diffent routingKeys in paralllel', async () => {
			const order = [];
			await Promise.all([
				pateka.add({
					routingKey: 1,
					id: 1,
					async task() {
						await delay(200);
						order.push(1);
					},
				}),
				pateka.add({
					routingKey: 2,
					id: 2,
					async task() {
						await delay(50);
						order.push(2);
					},
				}),
			]);
			order.length.should.equal(2);
			order[0].should.equal(2);
			order[1].should.equal(1);
		});

		it('should remove tasks that are done', async () => {
			const order = [];
			await Promise.all([
				pateka.add({
					routingKey: 1,
					id: 1,
					async task() {
						await delay(200);
						order.push(1);
					},
				}),
				pateka.add({
					routingKey: 2,
					id: 2,
					async task() {
						await delay(50);
						order.push(2);
					},
				}),
			]);
			pateka.tracks.forEach(t => t.size.should.equal(0));
		});

		it('should remove tasks that are done even if exception occured', async () => {
			await assert.rejects(() => pateka.add({
				routingKey: 1,
				id: 1,
				async task() {
					throw new Error();
				},
			}));
			pateka.tracks.forEach(track => track.size.should.equal(0));
		});
	});
});
