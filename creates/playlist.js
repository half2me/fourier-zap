const { findSong } = require('../music')

const addToPlaylist = async (z, bundle) => {
    let song = await findSong(z, bundle.inputData.song, bundle.inputData.artist, bundle.authData.storefront);
    await z.request(`https://api.music.apple.com/v1/me/library?ids[songs]=${song.id}`, {method: 'POST'});
    return song;
}

const getPlaylists = async (z, bundle) => {
    let {json: {data: playlists}} = await z.request('https://api.music.apple.com/v1/me/library/playlists', {params: {
        limit: 100,
        // TODO: add offset for any amount of playlists
    }});

    return playlists;
}

module.exports = {
    key: 'playlist',
    noun: 'Playlist',

    display: {
        label: 'Add song to Playlist',
        description: 'Adds a song to your Apple Music Playlist'
    },

    operation: {
        inputFields: [
            {key: 'song', label:'Song', type: 'string', required: true},
            {key: 'artist', label:'Artist', type: 'string'},
        ],
        perform: addToLibrary,
    }
};