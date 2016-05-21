'use strict';

var Worker = require('./lib/worker'),
	worker;

worker = new Worker();
worker.run();