const { baseUrl, transformSongResult, findByIsrcOrSearch } = require('../music');
const sampleTrack = require('../samples/track');
const sampleLibraryTrack = require('../samples/library');

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

const addTrackToPlaylist = async (z, { inputData: { playlist_id, song, artist, isrc }, authData: { storefront: sf } }) => {
  const result = await findByIsrcOrSearch(z, song, artist, isrc, sf);
  await z.request({
    url: `${baseUrl}/me/library/playlists/${playlist_id}/tracks`,
    method: 'POST',
    json: true,
    body: { data: [ { id: result.id, type: 'songs' } ] },
  });
  return result;
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
      sampleTrack,
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
      sampleTrack,
    },
  },
  create: {
    display: {
      label: 'Add a song to a playlist',
      description: 'Adds a song to your playlist.',
    },
    operation: {
      inputFields: [
        { key: 'playlist_id', required: true, label: 'Playlist', dynamic: 'playlist.id.name' },
        { key: 'song', label: 'Song', type: 'string', required: false, helpText: 'Name of the song' },
        { key: 'artist', label: 'Artist', type: 'string', required: false, helpText: 'Name of the artist or artists separated by commas' },
        { key: 'isrc', label: 'ISRC', type: 'string', required: false, helpText: 'International Standard Recording Code. If you specify this ISRC code, the matching algorithm has the highest accuracy.' },
      ],
      perform: addTrackToPlaylist,
      sample: sampleLibraryTrack,
    },
  },
  sampleTrack,
  outputFields: [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'dateAdded', label: 'Date Added' },
  ],
};
