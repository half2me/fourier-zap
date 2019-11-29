const { baseUrl } = require('../music');
const sample = require('../samples/track');
const { transformSongResult } = require('../music');

const getPlaylistTrack = (z, { inputData: { id } }) => z
  .request(`${baseUrl}/me/library/songs/${id}`)
  .then(({ json: { data } }) => transformSongResult(data[0]));

const listPlaylistTracks = async (z, { inputData: { playlist_id: id } }) => {
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

module.exports = {
  key: 'playlistTrack',
  noun: 'Track',
  get: {
    display: {
      label: 'Get Playlist Track',
      description: 'Gets a track from a playlist.',
    },
    operation: {
      inputFields: [{ key: 'id', required: true }],
      perform: getPlaylistTrack,
      sample,
    },
  },
  list: {
    display: {
      label: 'New Track Added to Playlist',
      description: 'Triggers when a new track is added to one of your playlists.',
    },
    operation: {
      inputFields: [
        {
          key: 'playlist_id',
          required: true,
          label: 'Playlist',
          dynamic: 'playlist.id.name',
        },
      ],
      perform: listPlaylistTracks,
      sample,
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
