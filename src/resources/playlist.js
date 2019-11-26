const { baseUrl } = require('../music');
const _ = require('lodash');
const sample = require('../samples/playlist');

const mapPlaylist = (p) => ({
  id: p.id,
  name: p.attributes.name,
  description: p.attributes.description ? p.attributes.description.standard : null, // TODO: use conditional chaining with babel
  dateAdded: p.attributes.dateAdded,
});

const getPlaylist = (z, { inputData: { id } }) => z
  .request(`${baseUrl}/me/library/playlists/${id}`)
  .then(({ json: { data } }) => mapPlaylist(data[0]));

const listPlaylists = (z) => z
  .request(`${baseUrl}/me/library/playlists`, { params: { limit: 100 } })
  .then(({ json: { data } }) => _.sortBy(data.map(mapPlaylist), 'dateAdded', 'desc'));

const createPlaylist = (z, { inputData: { name, description } }) => z
  .request(`${baseUrl}/me/library/playlists`, {
    method: 'POST', body: JSON.stringify({
      attributes: { name, description },
    }),
  })
  .then(({ json: { data } }) => mapPlaylist(data[0])); // dateAdded will not be available here

module.exports = {
  key: 'playlist',
  noun: 'Playlist',
  get: {
    display: {
      label: 'Get Playlist',
      description: 'Gets a playlist.',
    },
    operation: {
      inputFields: [{ key: 'id', required: true }],
      perform: getPlaylist,
      sample,
    },
  },
  list: {
    display: {
      label: 'New Playlist',
      description: 'Triggers when a new playlist is added.',
    },
    operation: {
      perform: listPlaylists,
      sample,
    },
  },
  create: {
    display: {
      label: 'Create Playlist',
      description: 'Creates a new playlist.',
    },
    operation: {
      inputFields: [
        {
          key: 'name',
          required: true,
          type: 'string',
          label: 'Name',
          helpText: 'Name of the playlist',
        },
        {
          key: 'description',
          required: false,
          type: 'text',
          label: 'Description',
          helpText: 'Playlist description which will be shown in the playlist details',
        },
      ],
      perform: createPlaylist,
      sample: {
        ...sample,
        dateAdded: undefined, // This field is not returned on create
      },
    },
  },
  sample,
  outputFields: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'dateAdded', label: 'Date Added' },
  ],
};
