const { baseUrl } = require('../music')

const mapPlaylist = ({json: r}) => ({
  id: r.id,
  name: r.attributes.name,
  dateAdded: r.attributes.dateAdded,
  description: r.attributes.description.standard,
});

const getPlaylist = (z, {inputData: {id}}) => z
  .request(`${baseUrl}/me/library/playlists/${id}`)
  .then(mapPlaylist);

const listPlaylists = (z, bundle) => z
  .request(`${baseUrl}/me/library/playlists`, {params: {limit: 100}})
  .then(mapPlaylist);

const createPlaylist = (z, bundle) => {
  return z
    .request()
    .then(({json: r}) => ({}));
};

const sample = {
  id: "p.eoGxB3vSJao3Km",
  name: "My amazing playlist",
  dateAdded: "2019-09-01T19:42:34Z",
  description: "This playlists holds my favourite tracks",
};

module.exports = {
  key: 'playlist',
  noun: 'Playlist',
  // The get method is used by Zapier to fetch a complete representation of a record. This is helpful when the HTTP
  // response from a create call only return an ID, or a search that only returns a minimuml representation of the
  // record. Zapier will follow these up with the get() to retrieve the entire object.
  get: {
    display: {
      label: 'Get Playlist',
      description: 'Gets a playlist.'
    },
    operation: {
      inputFields: [{ key: 'id', required: true }],
      perform: getPlaylist,
      sample: sample
    }
  },
  // The list method on this resource becomes a Trigger on the app. Zapier will use polling to watch for new records
  list: {
    display: {
      label: 'New Playlist',
      description: 'Trigger when a new playlist is added.'
    },
    operation: {
      perform: listPlaylists,
      sample: sample
    },
  },

  // The create method on this resource becomes a Write on this app
  create: {
    display: {
      label: 'Create Playlist',
      description: 'Creates a new playlist.'
    },
    operation: {
      inputFields: [
        { key: 'name', required: true, type: 'string' },
        {
          key: 'directions',
          required: true,
          type: 'text',
          helpText: 'Explain how should one make the recipe, step by step.'
        },
        {
          key: 'authorId',
          required: true,
          type: 'integer',
          label: 'Author ID'
        },
        {
          key: 'style',
          required: false,
          type: 'string',
          helpText: 'Explain what style of cuisine this is.'
        }
      ],
      perform: createRecipe,
      sample: sample
    }
  },
  // The search method on this resource becomes a Search on this app
  search: {
    display: {
      label: 'Find Recipe',
      description: 'Finds an existing recipe by name.'
    },
    operation: {
      inputFields: [{ key: 'name', required: true, type: 'string' }],
      perform: searchRecipe,
      sample: sample
    }
  },

  // In cases where Zapier needs to show an example record to the user, but we are unable to get a live example
  // from the API, Zapier will fallback to this hard-coded sample. It should reflect the data structure of
  // returned records, and have obviously dummy values that we can show to any user.
  sample: sample,

  // If the resource can have fields that are custom on a per-user basis, define a function to fetch the custom
  // field definitions. The result will be used to augment the sample.
  // outputFields: () => { return []; }
  // Alternatively, a static field definition should be provided, to specify labels for the fields
  outputFields: [
    { key: 'id', label: 'ID' },
    { key: 'createdAt', label: 'Created At' },
    { key: 'name', label: 'Name' },
    { key: 'directions', label: 'Directions' },
    { key: 'authorId', label: 'Author ID' },
    { key: 'style', label: 'Style' }
  ]
};