const should = require('should');
const zapier = require('zapier-platform-core');
zapier.tools.env.inject();
const App = require('../index');
const appTester = zapier.createAppTester(App);
const {token} = require('../music')

describe('Fourier', () => {
  describe('auth', () => {
    it('should save my storefront', done => {
      const bundle = {
        authData: {
          token: process.env.USERTOKEN,
        },
      };

      appTester(App.authentication.sessionConfig.perform, bundle).then(r => {
        r.should.have.property('storefront');
        done();
      }).catch(done)
    })
  });
  describe('library', () => {
    it('should add song to library', done => {
      const bundle = {
        authData: {
          token: process.env.USERTOKEN,
          storefront: 'gb', // TODO: why do I need this, should be done automatically
        },
        inputFields: {
          song: 'Circles',
          artist: 'Post Malone',
        },
      };

      appTester(App.creates.library.operation.perform, bundle).then(r => {
        r.status.should.eql(202)
        done();
      }).catch(done);
    })
  });
});
