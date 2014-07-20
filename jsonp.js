loadJSONP = (function(window, undefined) {
	
	var defaults = {
		callbackParam: 'callback',
		callbackName: '__jsonp',
		timeout: 5000
	};
	var options = {};

	var extend = function(a, b) {
		var c = {};
		for (var prop in a) {
			if (a.hasOwnProperty(prop)) {
				c[prop] = a[prop];
			}
		}

		for (var prop in b) {
			if (b.hasOwnProperty(prop)) {
				c[prop] = b[prop];
			}
		}
		return c;
	};

	var loadScript = function(url) {
		var head   = document.querySelector('head'),
			script = document.createElement('script');

		script.src = url;

		head.appendChild(script);
	};

	var loadJSONP = function(url, overrideOptions, success, error) {
		var timeoutTimer;

		overrideOptions.callbackName = overrideOptions.callbackName || defaults.callbackName + new Date().getTime() + Math.round(Math.random()*1000001);
		overrideOptions.loadScript   = overrideOptions.loadScript || loadScript;
		options = extend(defaults, overrideOptions);

		url += (url.indexOf('?') === -1 && url.indexOf('#') === -1 ? '?': '&');
		url += options.callbackParam + '=' + options.callbackName;

		if (typeof error === 'function') { 
			timeoutTimer = setTimeout(function() {
				error('timeout');
				delete window[options.callbackName];
			}, options.timeout);
		}

		window[options.callbackName] = function(data) {
			success(data);
			clearTimeout(timeoutTimer);
			delete window[options.callbackName];
		};

		options.loadScript(url);
	};

	return loadJSONP;
	
})(window);