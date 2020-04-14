const jwt = require('jsonwebtoken');

const {
  PRIVKEY,
  PRIVKEY64,
  TEAMID: issuer,
  KEYID: keyid,
} = process.env;

const key = PRIVKEY || Buffer.from(PRIVKEY64 || '', 'base64').toString();

const tokenOptions = {
  expiresIn: '1h',
  algorithm: 'ES256',
  issuer,
  keyid,
};

const baseUrl = 'https://api.music.apple.com/v1';

const transformSongResult = (result) => ({
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

const token = () => jwt.sign({}, key, tokenOptions);

const findByIsrc = (z, isrc, sf) => z.request({
  url: `${baseUrl}/catalog/${sf}/songs`,
  params: { 'filter[isrc]': isrc },
}).then(({ json: { data } }) => {
  if (data[0]) {
    return {
      ...transformSongResult(data[0]),
      match: { type: 'isrc', confidence: 1.0 },
    };
  }
  return null;
});

const findBySearch = (z, song, artist, sf) => {
  const artistTerm = artist.replace(/,/g, '+');
  const term = `${artistTerm}+${song}`
    .replace(/ /g, '+')
    .replace(/&/g, '');
  return z.request({
    url: `${baseUrl}/catalog/${sf}/search?term=${term}`,
    params: { limit: 20, types: 'songs'},
  }).then(({ json: { results } }) => {
    if (results.songs) {
      return {
        ...transformSongResult(results.songs.data[0]),
        match: {
          type: 'search',
          confidence: 0.8,
        },
      };
    }
    return null;
  });
};

const findByIsrcOrSearch = (z, song, artist, isrc, sf) => {
  z.console.log(`Storefront is ${sf}.`)
  let result = null;

  if (isrc) {
    z.console.log(`Searching by ISRC: ${isrc}.`);
    result = findByIsrc(z, isrc, sf);
  }

  if (!result) {
    z.console.log(`Searching by terms. Artist: ${artist} Song: ${song}.`);
    result = findBySearch(z, song, artist, sf);
  }

  if (result) {
    z.console.log(`Search successful! AMID: ${result.id}.`);
    return result;
  }

  z.console.log('Search found no results :(');
  throw new Error('No results');
};


module.exports = { token, findByIsrcOrSearch, baseUrl, transformSongResult };
