const getStorefront = (z, bundle) => z.request('https://api.music.apple.com/v1/me/storefront');

const getAccessToken = async (z, {cleanedRequest: {querystring: q}}) => ({
  access_token: q.code,
  storefront: q.sf,
});

module.exports = {
  type: 'oauth2',
  oauth2Config: {
    authorizeUrl: {
      url: process.env.OAUTH_URL,
      params: {
        client_id: '{{process.env.CLIENT_ID}}',
        state: '{{bundle.inputData.state}}',
        redirect_uri: '{{bundle.inputData.redirect_uri}}',
        response_type: 'code'
      }
    },
    getAccessToken,
    autoRefresh: false,
  },  
  test: getStorefront,
  connectionLabel: "Apple Music",
};