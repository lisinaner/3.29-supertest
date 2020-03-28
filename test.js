'use strict';

const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');

describe('request(app)', function () {
	it('应该在自动启动应用程序', function (done) {
		const app = express();

		app.get('/', function (req, res) {
			res.send('hey');
		});
		request(app)
			.get('/')
			.end(function (err, res) {
				res.status.should.equal(200);
				res.text.should.equal('hey');
				done();
			});
	});
	it('在激活的服务器也可以使用', function (done) {
		const app = express();
		let server;

		app.get('/', function (req, res) {
			res.send('hey');
		});

		server = app.listen(4000, function () {
			request(server)
				.get('/')
				.end(function (err, res) {
					res.status.should.equal(200);
					res.text.should.equal('hey');
					done();
				});
		});
	});
	it('远程服务器也可以使用', function (done) {
		const app = express();

		app.get('/', function (req, res) {
			res.send('hey');
		});

		app.listen(4001, function () {
			request('http://localhost:4001')
				.get('/')
				.end(function (err, res) {
					res.status.should.equal(200);
					res.text.should.equal('hey');
					done();
				});
		});
	});
	it('可以使用send发送参数', function (done) {
		const app = express();

		app.use(bodyParser.json());

		app.post('/', function (req, res) {
			res.send(req.body.name);
		});

		request(app)
			.post('/')
			.send({ name: 'john' })
			.expect('john', done);
	});
	it('无缓冲时候应该有效', function (done) {
		const app = express();

		app.get('/', function (req, res) {
			res.end('Hello');
		});

		request(app)
			.get('/')
			.expect('Hello', done);
	});
	it('应支持嵌套请求', function (done) {
		const app = express();
		const test = request(app);

		app.get('/', function (req, res) {
			res.send('supertest FTW!');
		});

		test
			.get('/')
			.end(function () {
				test
					.get('/')
					.end(function (err, res) {
						(err === null).should.be.true;
						res.status.should.equal(200);
						res.text.should.equal('supertest FTW!');
						done();
					});
			});
	});
})

