/* global outdatedBrowser, FastClick */

(function ($, window, document, undefined) {

	'use strict';

	//--------------------------------------------|
	// AVOID CONSOLE ERRORS (<= IE9)
	//--------------------------------------------|
	(function(){
		var method;
		var noop = function () {};
		var methods = [
			'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
			'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
			'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
			'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
		];
		var length = methods.length;
		var console = (window.console = window.console || {});

		while (length--) {
			method = methods[length];

			// Only stub undefined methods.
			if (!console[method]) {
				console[method] = noop;
			}
		}
	})();

	//--------------------------------------------|
	// VENDOR & PLUGINS
	//--------------------------------------------|
	(function(){

		// OUTDATED BROWSER (<= IE8)
		//----------------------------------------|
		outdatedBrowser({
			bgColor: '#f25648',
			color: '#ffffff',
			lowerThan: 'boxShadow',
			languagePath: ''
		});

		// FASTCLICK.JS
		//----------------------------------------|
		FastClick.attach(document.body);

	})();

	//--------------------------------------------|
	// APP
	//--------------------------------------------|
	(function(){

		console.log('Lets get started!');

	})();

})(jQuery, window, document);
