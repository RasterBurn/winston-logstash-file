var winston = require('winston');
var File = require('winston/lib/winston/transports/file').File;
var common = require('winston/lib/winston/common');
var util = require('util');
var cycle = require('cycle');

var LogstashFile = exports.LogstashFile = function (options) {
	File.call(this, options);
};

util.inherits(LogstashFile, File);

LogstashFile.prototype.name = 'logstashFile';

winston.transports.LogstashFile = LogstashFile;

LogstashFile.prototype.log = function (level, msg, meta, callback) {
	var args = Array.prototype.slice.call(arguments);

	var output = common.clone(cycle.decycle(meta)) || {};
	var timestamp = common.timestamp();
	this.timestamp = function () { return timestamp; };

	if (typeof msg !== 'string') {
		msg = '' + msg;
	}

	var logstashOutput = {};
	if (msg !== undefined && msg !== null) {
		logstashOutput['@message'] = msg;
	}

	logstashOutput['@timestamp'] = timestamp;
	logstashOutput['@fields'] = common.clone(output);
	args[2] = logstashOutput;

	File.prototype.log.apply(this, args);
};

