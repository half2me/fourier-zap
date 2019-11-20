const { findSong } = require('../music')

const addToLibrary = async (z, bundle) => {
    let song = await findSong(z, bundle.inputData.song, bundle.inputData.artist, bundle.authData.storefront);
    await z.request(`https://api.music.apple.com/v1/me/library?ids[songs]=${song.id}`, {method: 'POST'});
    return song;
}

module.exports = {
    key: 'library',
    noun: 'Library',

    display: {
        label: 'Add song to library',
        description: 'Adds a song to your Apple Music library'
    },

    operation: {
        inputFields: [
            {key: 'song', label:'Song', type: 'string', required: true},
            {key: 'artist', label:'Artist', type: 'string', required: false}
        ],
        perform: addToLibrary,
    }
};