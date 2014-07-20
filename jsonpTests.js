var expect = chai.expect;
var echoServiceUrl = 'http://jsfiddle.net/echo/jsonp/';

describe('Load JSONP', function() {
	it('should get the data from echo service', function(done) {
		loadJSONP(echoServiceUrl + '?hello=world', {}, function(data) {
			expect(data.hello).to.equal('world');
			done();
		});
	});
});

var loadScriptFactory = function(successData, timeout, paramName, callbackName) {
	return function(url) {
		var regex        = new RegExp((paramName || 'callback') + '=(.*)');

		callbackName = callbackName || url.match(regex)[1],
		successData  = successData || { 'hello': 'world' };

		setTimeout(function() {
			if (window[callbackName]) {
				window[callbackName](successData);
			}
		}, timeout || 0);
	};
};

describe('Load JSONP stub', function() {
	it('should get the data from service', function(done) {
		loadJSONP(echoServiceUrl + '?hello=world', { loadScript: loadScriptFactory() }, function(data) {
			expect(data.hello).to.equal('world');
			done();
		});
	});

	it('should call loadScript once with with correct params', function(done) {
		var spyLoadScript = sinon.spy(loadScriptFactory(false, false, 'cb', '__jsonpWrapper'));
		loadJSONP(echoServiceUrl + '?hello=world', { loadScript: spyLoadScript, callbackParam: 'cb', callbackName: '__jsonpWrapper' }, function(data) {
			expect(spyLoadScript.callCount).to.equal(1);
			expect(spyLoadScript.calledWith(echoServiceUrl + '?hello=world&cb=__jsonpWrapper')).to.equal.true;
			done();
		});
	});

	it('should call error if timeout', function(done) {
		loadJSONP(echoServiceUrl + '?hello=world', { loadScript: loadScriptFactory(false, 40), timeout: 30 }, function() {}, function(error) {
			expect(error).to.equal('timeout');
			done();
		});
	});	
});