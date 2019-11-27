const { baseUrl } = require('../music');
const sample = require('../samples/playlistTrack');
const { transformSongResult } = require('../music');

const getPlaylistTrack = (z, { inputData: { id } }) => z
  .request(`${baseUrl}/me/library/songs/${id}`)
  .then(({ json: { data } }) => transformSongResult(data[0]));

const listPlaylistTracks = async (z, { inputData: { playlistId: id } }) => {
  const reqOpt = {
    url: `${baseUrl}/me/library/playlists/${id}/tracks`,
    params: {
      limit: 100, // 100 is the max limit allowed by AM
      offset: 0,
    },
  };

  let { json: { data, meta } } = await z.request(reqOpt);

  if (meta.total > 100) {
    reqOpt.params.offset = meta.total - 100; // fetch the last 100 results
    const r = await z.request(reqOpt);
    data = r.json.data;
    meta = r.json.meta;
  }

  return data.map(transformSongResult).reverse();
};

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
