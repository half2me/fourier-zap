const jwt = require('jsonwebtoken')

const {
    PRIVKEY,
    PRIVKEY64,
    TEAMID: issuer,
    KEYID: keyid,
} = process.env

const key = PRIVKEY || Buffer.from(PRIVKEY64, 'base64').toString()

const tokenOptions = {
    expiresIn: '1h',
    algorithm: 'ES256',
    issuer,
    keyid,
}

const token = () => jwt.sign({}, key, tokenOptions)

const defaultPicker = ({song, artist}, results = []) => {
    return results[0];
}

const findSong = (z, song, artist, picker = defaultPicker) => {
    let artistTerm = artist.replace(/,/g, '+')
    let term = `${artistTerm}+${song}`.replace(/ /g, '+')
    let storeFront = 'gb' // TODO: replace with dynamic
    return z.request(`https://api.music.apple.com/v1/catalog/${storefront}/search`, {
        params: {
            limit: 20,
            types: 'songs',
            term,
        }
    }).then(({json: {results}}) => {
        if (results.songs) {
            return picker({song, artist}, results.songs.data);
        } else {
            throw new Error("No results")
        }
    })
}