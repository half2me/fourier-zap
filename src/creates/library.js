const { baseUrl } = require('../music');
const sample = require('../samples/library');

const addToLibrary = async (z, { inputData: { id } }) => z.request({
  url: `${baseUrl}/me/library`,
  method: 'POST',
  params: { 'ids[songs]': id },
});

module.exports = {
  key: 'library',
  noun: 'Library',

  display: {
    label: 'Add song to library',
    description: 'Adds a song to your Apple Music library',
  },

  operation: {
    inputFields: [
      {
        key: 'id',
        required: true,
        label: 'Track',
        dynamic: 'track.id.name',
        search: 'trackSearch.id',
        helpText: 'The track to add',
      },
    ],
    perform: addToLibrary,
    sample,
  },
};
