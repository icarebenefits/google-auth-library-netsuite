var sinon = require('sinon');

var expect = require('chai').expect;

var extend = require('extend');

global.NS = require('../ns');

global.NS._traceRequest = function(){};

var request = require('../../../lib/ss2/request.js');

describe('request', function() {

    var http = NS.http;
    var https = NS.https;
    
    beforeEach(function() {
        NS.http = extend(true, {}, http);
        NS.https = extend(true, {}. https);
        //this.timeout(1000);
    });

    afterEach(function() {
        NS.http = http;
        NS.https = https;
    });

    var tests = {
        http : 'http://localhost',
        https: 'https://localhost'
    };

    for (var protocol in tests) {
        it ('should call ' + protocol + ' module', function() {
            var nsResponse = {
                code: 200,
                headers: {
                    'Server': 'Sinon Stub'
                },
                body: 'stub'
            };

            var stub = sinon.stub().returns(nsResponse);
            NS[protocol].request = stub;

            var uri = tests[protocol];
            var options = {};
            var onResponse = function(error, response, body) {
                expect(error).to.equal(null);
                expect(response).to.have.property('statusCode').to.equal(200);
                expect(response).to.have.property('headers').to.have.property('Server').to.equal('Sinon Stub');
                expect(response).to.have.property('nsResponse').to.equal(nsResponse);
                expect(body).to.equal('stub');
            };

            request(uri, options, onResponse);

            expect(stub.called).to.equal(true);
        });
    }

    it ('it should report SuiteScriptError', function() {
        var nsResponse = {
            code: 400,
            headers: {
                'Server': 'Sinon Stub'
            },
            body: 'stub'
        };
        var stub = sinon.stub().returns(nsResponse);
        NS.https.request = stub;

        var spy = sinon.spy(request);
        spy('https://localhost', {}, function(error, response, body) {
            expect(error).to.be.a('error');
        });
    })
});