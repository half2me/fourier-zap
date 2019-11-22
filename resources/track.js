const { baseUrl } = require('../music')
const _ = require('lodash');
const sample = require('../samples/track')
const { transformSongResult } = require('../music')

const getTrack = (z, { inputData: { id }, authData: {storefront: sf} }) => z
  .request(`${baseUrl}/catalog/${sf}/songs/${id}/`)
  .then(({ json: { data } }) => transformSongResult(data[0]));

const searchTrack = (z, { inputData: { track, artist, isrc } }) => z
  .request(`${baseUrl}/me/library/playlists`, { params: { limit: 100 } })
  .then(({ json: { data } }) => _.sortBy(data.map(mapPlaylist), 'dateAdded', 'desc'));

module.exports = {
  key: 'track',
  noun: 'Track',
  search: {
    display: {
      label: 'Get Track',
      description: 'Gets a Track'
    },
    operation: {
      inputFields: [
        {
          key: 'track',
          label: 'Track Name',
          type: 'string',
          required: true,
          helpText: "Name of the track"
        },
        {
          key: 'artist',
          label: 'Artist Name',
          type: 'string',
          required: false,
          helpText: "Name of the artist or artists separated by commas"
        },
        {
          key: 'isrc',
          label: 'ISRC',
          type: 'string',
          required: false,
          helpText: "International Standard Recording Code. If you specify this ISRC code, the matching algorithm has the highest accuracy."
        },
      ],
      perform: getTrack,
      sample,
    }
  },
  sample,
  outputFields: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'dateAdded', label: 'Date Added' },
  ]
};
