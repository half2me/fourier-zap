const should = require('should');
const zapier = require('zapier-platform-core');
const App = require('../index');
const appTester = zapier.createAppTester(App);

zapier.tools.env.inject();

describe('Fourier', () => {
  it('should test something', done => {
    const x = 1;
    x.should.eql(1);

    // const bundle = { inputData: {} };
    // const results = appTester(App.triggers.SOME_TRIGGER.operation.perform, bundle);
    // results.length.should.eql(3);
    done();
  });
});
