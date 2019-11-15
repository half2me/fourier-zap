const getStorefront = (z, bundle) => {
    z.request('https://api.music.apple.com/v1/me/storefront').then(({json: {data}}) => ({
        storefront: data[0].id
    }))
}

module.exports = {
    type: 'session',
    fields: [
        {
            key: 'token',
            label: 'Apple Music User Token',
            required: true,
            type: 'string',
        },
        {
            key: 'storefront',
            label: 'Storefront',
            required: false,
            computed: true,
        },
    ],
    test: getStorefront,
    sessionConfig: {
        perform: getStorefront
    },
    connectionLabel: (z, bundle) => {
        return "Apple Music";
    }
};