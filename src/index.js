const authentication = require('./auth');
const libraryCreate = require('./creates/library');
const Playlist = require('./resources/playlist');
const PlaylistTrack = require('./resources/playstTrack');
const { token } = require('./music');

const addAppleAuth = (request, z, bundle) => {
  request.headers.Authorization = `Bearer ${token()}`;
  request.headers['Music-User-Token'] = bundle.authData.access_token;
  return request;
};

const handleHTTPError = (response) => {
  if (response.status >= 400) {
    throw new Error(`Unexpected status code ${response.status}`);
  }
  return response;
};

// We can roll up all our behaviors in an App.
const App = {
  // This is just shorthand to reference the installed dependencies you have. Zapier will
  // need to know these before we can upload
  version: require('../package.json').version,
  platformVersion: require('zapier-platform-core').version,
  authentication,

  // beforeRequest & afterResponse are optional hooks into the provided HTTP client
  beforeRequest: [
    addAppleAuth,
  ],

  afterResponse: [
    handleHTTPError,
  ],

  // If you want to define optional resources to simplify creation of triggers, searches, creates - do that here!
  resources: {
    [Playlist.key]: Playlist,
    [PlaylistTrack.key]: PlaylistTrack,
  },

  // If you want your trigger to show up, you better include it here!
  triggers: {},

  // If you want your searches to show up, you better include it here!
  searches: {},

  // If you want your creates to show up, you better include it here!
  creates: {
    [libraryCreate.key]: libraryCreate,
  },
};

// Finally, export the app.
module.exports = App;
