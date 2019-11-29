const sample = require('../samples/track');
const { findByIsrc, findBySearch, baseUrl, transformSongResult } = require('../music');

const getTrack = (z, { inputData: { id }, authData: { storefront: sf } }) => z
  .request(`${baseUrl}/catalog/${sf}/songs/${id}`)
  .then(({ json: { data } }) => transformSongResult(data[0]));

const searchForTrack = async (z, { inputData: { song, artist, isrc }, authData: { storefront: sf } }) => {
  let result;
  if (isrc) {
    result = await findByIsrc(z, isrc, sf);
  } else if (song) {
    result = await findBySearch(z, song, artist, sf);
  } else {
    throw new Error('Either ISRC or Song/Artist must be specified!');
  }

  return result ? [ result ] : [];
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
    { key: 'artist', label: 'Artist' },
    { key: 'name', label: 'Name' },
    { key: 'album', label: 'Album' },
    { key: 'trackNumber', label: 'Track Number' },
    { key: 'composer', label: 'Composer' },
    { key: 'url', label: 'Url' },
    { key: 'duration', label: 'Duration' },
    { key: 'releaseDate', label: 'Release Date' },
    { key: 'isrc', label: 'ISRC' },
  ],
};
