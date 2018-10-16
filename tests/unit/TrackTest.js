'use strict';

/* eslint-env node, mocha */

const { should: shouldFn } = require('chai');
const Track = require('../../lib/Track');

const should = shouldFn();

// const neverEndingTask = () => new Promise();

describe('Track', () => {
	it('should have the right interface', () => {
		const track = new Track();
		track.add.should.be.a('function');
		track.remove.should.be.a('function');
		track.hasRoutingKey.should.be.a('function');
		track.size.should.equal(0);
		track.routingKeys.should.be.an('object').that.is.empty; // eslint-disable-line
		track.ids.should.be.an('object').that.is.empty; // eslint-disable-line
	});

	it('should initilize with defualt options', () => {
		const track = new Track();
		track.queue._concurrency.should.equal(1);
	});

	it('should accept the right options', () => {
		const track = new Track({ concurrency: 6 });
		track.queue._concurrency.should.equal(6);
	});

	describe('add', () => {
		let track;
		beforeEach(() => {
			track = new Track();
		});

		it('should add the right routingKey and id to the track', () => {
			track.add({ id: '1', routingKey: '1' });
			track.ids['1'].should.be.equal(true);
			track.routingKeys['1'].should.be.equal(1);
		});

		it('should add the right routingKey and id to the track when routingkey alredy there', () => {
			track.add({ id: '1', routingKey: '1' }).add({ id: '2', routingKey: '1' });
			track.ids['1'].should.be.equal(true);
			track.ids['2'].should.be.equal(true);
			track.routingKeys['1'].should.be.equal(2);
		});

		it('should remove routingKey and id when task is removed', () => {
			track.add({ id: '1', routingKey: '1' });
			track.remove({ id: '1', routingKey: '1' });
			track.routingKeys.should.be.an('object').that.is.empty; // eslint-disable-line
			track.ids.should.be.an('object').that.is.empty; // eslint-disable-line
		});

		it('should leave routingKey and remove only id when task is removed but other are pending', () => {
			track.add({ id: '1', routingKey: '1' }).add({ id: '2', routingKey: '1' });
			track.remove({ id: '1', routingKey: '1' });
			should.not.exist(track.ids['1']);
			track.ids['2'].should.be.equal(true);
			track.routingKeys['1'].should.be.equal(1);
		});

		it('should remove all routingkeys and ids when task is fhinished', () => {
			track.add({ id: '1', routingKey: '1' }).add({ id: '2', routingKey: '1' });
			track.remove({ id: '1', routingKey: '1' }).remove({ id: '2', routingKey: '1' });
			track.routingKeys.should.be.an('object').that.is.empty; // eslint-disable-line
			track.ids.should.be.an('object').that.is.empty; // eslint-disable-line
		});
	});
});
