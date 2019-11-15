const { findSong } = require('../music')

const addToLibrary = async (z, bundle) => {
    let {id} = await findSong(z, bundle.inputFields.song, bundle.inputFields.artist, bundle.authData.storefront);
    return await z.request(`https://api.music.apple.com/v1/me/library?ids[songs]=${id}`, {method: 'POST'});
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