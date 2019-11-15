module.exports = {
    type: 'custom',
    fields: [
        {
            key: 'token',
            label: 'Apple Music User Token',
            required: true,
            type: 'string',
        },
    ],
    test: {
        url: 'https://api.music.apple.com/v1/me/storefront'
    },
    connectionLabel: (z, bundle) => {
        z.console.log(bundle.authData)
        return "Apple Music";
    }
};