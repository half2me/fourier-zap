const sample = require('../samples/track');
const { findByIsrc, findBySearch, baseUrl, transformSongResult } = require('../music');

const getTrack = (z, { inputData: { id }, authData: { storefront: sf } }) => z
  .request(`${baseUrl}/catalog/${sf}/songs/${id}`)
  .then(({ json: { data } }) => transformSongResult(data[0]));

const searchForTrack = (z, { inputData: { song, artist, isrc }, authData: { storefront: sf } }) => {
  if (isrc) {
    return findByIsrc(z, isrc, sf);
  } else if (song) {
    return findBySearch(z, song, artist, sf);
  } else {
    throw new Error('Either ISRC or Song/Artist must be specified!');
  }
};

module.exports = {
  key: 'track',
  noun: 'Track',
  get: {
    display: {
      label: 'Get a Track',
      description: 'Gets a track.',
    },
    operation: {
      inputFields: [{ key: 'id', required: true }],
      perform: getTrack,
      sample,
    },
  },
  search: {
    display: {
      label: 'Find Track',
      description: 'Finds a track by artist & name or ISRC code.',
    },
    operation: {
      inputFields: [
        { key: 'song', label: 'Song', type: 'string', required: false, helpText: 'Name of the song' },
        { key: 'artist', label: 'Artist', type: 'string', required: false, helpText: 'Name of the artist or artists separated by commas' },
        { key: 'isrc', label: 'ISRC', type: 'string', required: false, helpText: 'International Standard Recording Code. If you specify this ISRC code, the matching algorithm has the highest accuracy.' },
      ],
      perform: searchForTrack,
      sample,
    },
  },
  sample,
  outputFields: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'artist', label: 'Artist' },
    { key: 'isrc', label: 'ISRC' },
  ],
};
