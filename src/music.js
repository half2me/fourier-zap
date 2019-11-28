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

const findSong = async (z, song, artist, isrc, sf) => {
  const artistTerm = artist.replace(/,/g, '+');
  const term = `${artistTerm}+${song}`
    .replace(/ /g, '+')
    .replace(/&/g, '');
  const { json: { results } } = await z.request(`${baseUrl}/catalog/${sf}/search?term=${term}`, {
    params: {
      limit: 20,
      types: 'songs',
    },
  });

  if (!results.songs) {
    // no results for search term
    if (isrc) {
      // we have an isrc, so we can try to search directly by isrc code
      const r = await z.request(`${baseUrl}/catalog/${sf}/songs`, { params: { 'filter[isrc]': isrc } });
      const firstIsrcMatch = r.json.data[0];
      if (firstIsrcMatch) {
        return {
          ...transformSongResult(firstIsrcMatch),
          match: {
            type: 'isrc without search',
            confidence: 0.9,
          },
        };
      } else {
        throw new Error('No results');
      }
    } else {
      throw new Error('No results');
    }
  }

  if (isrc) {
    const isrcMatch = results.songs.data.find((s) => isrc === s.attributes.isrc);
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
};


module.exports = { token, findSong, baseUrl, transformSongResult };
