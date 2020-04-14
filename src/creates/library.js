const { findByIsrcOrSearch, baseUrl } = require('../music');
const sample = require('../samples/library');

const addToLibrary = async (z, { inputData: { song, artist, isrc }, authData: { storefront: sf } }) => {
  const result = await findByIsrcOrSearch(z, song, artist, isrc, sf);
  z.console.log(result);
  await z.request(`${baseUrl}/me/library?ids[songs]=${result.id}`, { method: 'POST' });
  return result;
};

module.exports = {
  key: 'library',
  noun: 'Library',

  display: {
    label: 'Add Song to Library',
    description: 'Adds a song to your Apple Music library',
  },

  operation: {
    inputFields: [
      { key: 'song', label: 'Song', type: 'string', required: true, helpText: 'Name of the song' },
      { key: 'artist', label: 'Artist', type: 'string', required: true, helpText: 'Name of the artist or artists separated by commas' },
      { key: 'isrc', label: 'ISRC', type: 'string', required: true, helpText: 'International Standard Recording Code.' },
    ],
    perform: addToLibrary,
    sample,
  },
};
