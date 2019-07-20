'use strict';

var _ = require('underscore');
var ProxyLists;

var convert = {
	anonymityLevels: {
		'high-anonymous': 'elite',
		'anonymous': 'anonymous',
		'anonymous proxy': 'anonymous',
		'transparent': 'transparent',
		'transparent proxy': 'transparent',
	},
};

module.exports = {
	homeUrl: 'http://www.nntime.com/',
	abstract: 'scraper-paginated-list',
	defaultOptions: {
		waitForValidData: {
			test: function(item) {
				ProxyLists = ProxyLists || require('../index');
				return ProxyLists.isValidProxy(item);
			},
			checkFrequency: 50,
			timeout: 2000,
		},
	},
	config: {
		startPageUrl: 'http://www.nntime.com/',
		selectors: {
			item: '#proxylist tbody tr',
			itemAttributes: {
				ipAddress: 'td:nth-child(2)',
				port: 'td:nth-child(2)',
				anonymityLevel: 'td:nth-child(3)',
			},
			nextLink: '#navigation .selected + a',
		},
		parseAttributes: {
			ipAddress: function(ipAddress) {
				var match = ipAddress.match(/^(.+)document/);
				return match && match[1] || null;
			},
			port: function(port) {
				if (!port) return null;
				var match = port.match(/:([0-9]+)$/);
				if (!match || !match[1]) return null;
				port = parseInt(match[1]);
				if (_.isNaN(port)) return null;
				return port;
			},
			anonymityLevel: function(anonymityLevel) {
				if (!anonymityLevel) return null;
				anonymityLevel = anonymityLevel.trim().toLowerCase();
				return anonymityLevel && convert.anonymityLevels[anonymityLevel] || null;
			},
		},
	},
};
