const { baseUrl } = require('../music')

const mapPlaylist = p => ({
  id: p.id,
  name: p.attributes.name,
  description: p.attributes.description.standard,
  dateAdded: p.attributes.dateAdded,
});

const getPlaylist = (z, {inputData: {id}}) => z
  .request(`${baseUrl}/me/library/playlists/${id}`)
  .then(({json: {data}}) => mapPlaylist(data[0]));

const listPlaylists = (z, bundle) => z
  .request(`${baseUrl}/me/library/playlists`, {params: {limit: 100}})
  .then(({json: {data}}) => data.map(mapPlaylist));

const createPlaylist = (z, {inputData: {name, description}}) => z
  .request(`${baseUrl}/me/library/playlists`, {method: 'POST', body: JSON.stringify({
    attributes: {name, description}
  })})
  .then(({json: {data}}) => mapPlaylist(data[0])); // dateAdded will not be available here

const sample = {
  id: "p.eoGxB3vSJao3Km",
  name: "My amazing playlist",
  description: "This playlists holds my favourite tracks",
  dateAdded: "2019-09-01T19:42:34Z",
};

module.exports = {
  key: 'playlist',
  noun: 'Playlist',
  get: {
    display: {
      label: 'Get Playlist',
      description: 'Gets a playlist.'
    },
    operation: {
      inputFields: [{ key: 'id', required: true }],
      perform: getPlaylist,
      sample,
    }
  },
  list: {
    display: {
      label: 'New Playlist',
      description: 'Trigger when a new playlist is added.'
    },
    operation: {
      perform: listPlaylists,
      sample: [sample]
    },
  },
  create: {
    display: {
      label: 'Create Playlist',
      description: 'Creates a new playlist.'
    },
    operation: {
      inputFields: [
        {
          key: 'name',
          required: true,
          type: 'string',
          label: 'Name',
          helpText: 'Name of the playlist'
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
      }
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