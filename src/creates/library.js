const { findByIsrc, findBySearch, baseUrl } = require('../music');
const sample = require('../samples/library');

const addToLibrary = async (z, { inputData: { song, artist, isrc }, authData: { storefront: sf } }) => {
  let result;
  if (isrc) {
    result = await findByIsrc(z, isrc, sf);
  } else if (song) {
    result = await findBySearch(z, song, artist, sf);
  } else {
    throw new Error('Either ISRC or Song/Artist must be specified!');
  }
  await z.request(`${baseUrl}/me/library?ids[songs]=${result.id}`, { method: 'POST' });
  return result;
};

module.exports = {
  key: 'library',
  noun: 'Library',

  display: {
    label: 'Add song to library',
    description: 'Adds a song to your Apple Music library',
  },

  operation: {
    inputFields: [
      { key: 'song', label: 'Song', type: 'string', required: false, helpText: 'Name of the song' },
      { key: 'artist', label: 'Artist', type: 'string', required: false, helpText: 'Name of the artist or artists separated by commas' },
      { key: 'isrc', label: 'ISRC', type: 'string', required: false, helpText: 'International Standard Recording Code. If you specify this ISRC code, the matching algorithm has the highest accuracy.' },
    ],
    perform: addToLibrary,
    sample,
  },
};
