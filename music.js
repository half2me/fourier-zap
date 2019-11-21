const jwt = require('jsonwebtoken')

const {
    PRIVKEY,
    PRIVKEY64,
    TEAMID: issuer,
    KEYID: keyid,
} = process.env

const key = PRIVKEY || Buffer.from(PRIVKEY64 || '', 'base64').toString()

const tokenOptions = {
    expiresIn: '1h',
    algorithm: 'ES256',
    issuer,
    keyid,
}

const token = () => jwt.sign({}, key, tokenOptions)

const findSong = async (z, song, artist, isrc, sf) => {
    let artistTerm = artist.replace(/,/g, '+')
    let term = `${artistTerm}+${song}`.replace(/ /g, '+')
    const {json: {results}} = await z.request(`https://api.music.apple.com/v1/catalog/${sf}/search?term=${term}`, {
        params: {
            limit: 20,
            types: 'songs',
        }
    });

    if (!results.songs) {
        throw new Error('No results');   
    }

    if (isrc) {
        let isrcMatch = results.songs.data.find(s => isrc === s.attributes.isrc);
        if (isrcMatch) {
            return {
                ...transformSongResult(isrcMatch),
                match: {
                    type: 'isrc',
                    confidence: 1.00,
                },
            };
        }
    }

    return {
        ...transformSongResult(results.songs.data[0]),
        match: {
            type: 'first item on search',
            confidence: 0.8,
        },
    };
}

const transformSongResult = result => ({
    id: result.id,
    artist: result.attributes.artistName,
    name: result.attributes.name,
    album: result.attributes.albumName,
    trackNumber: result.attributes.trackNumber,
    composer: result.attributes.composerName,
    url: result.attributes.url,
    duration: result.attributes.durationInMillis,
    releaseDate: result.attributes.releaseDate,
    isrc: result.attributes.isrc,
});

module.exports = {token, findSong}