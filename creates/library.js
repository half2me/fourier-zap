const { findTrack, baseUrl } = require('../music')
const sample = require('../samples/library')

const addToLibrary = async (z, { inputData: { track, artist, isrc }, authData: { storefront: sf } }) => {
  let result = await findTrack(z, track, artist, isrc, sf);
  await z.request(`${baseUrl}/me/library?ids[songs]=${result.id}`, { method: 'POST' });
  return result;
}

module.exports = {
  key: 'library',
  noun: 'Save Track',

  display: {
    label: 'Save Track',
    description: 'Saves a track to your Apple Music library'
  },

  operation: {
    inputFields: [
      { key: 'track', label: 'Track Name', type: 'string', required: true, helpText: "Name of the track" },
      { key: 'artist', label: 'Artist Name', type: 'string', required: false, helpText: "Name of the artist or artists separated by commas" },
      { key: 'isrc', label: 'ISRC', type: 'string', required: false, helpText: "International Standard Recording Code. If you specify this ISRC code, the matching algorithm has the highest accuracy." },
    ],
    perform: addToLibrary,
    sample,
  }
};
