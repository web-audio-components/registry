
var doc     = module.exports          = {}
  , views   = module.exports.views    = {}
  , indexes = module.exports.indexes  = {};

doc._id = '_design/app';
doc.rewrites = [
  { from: '/components/all', to: '/_view/all' },
  { from: '/components/search', 
    to: '/_search/default', 
    query: { include_docs: 'true' } 
  },
  { from: '/components', to: '../../' },
  { from: '/components/*', to: '../../*' }
];

views.all = {
  map: (function (doc, req) {
    if (doc._id.indexOf('_design') === -1)
      emit(doc._id, doc);
  }).toString()
};

indexes.default = {
  index: (function (doc) {
    var fullText = [
      doc.description,
      doc._id,
      doc.author.name,
      doc.author.email
    ].join(' ');
    index('default', fullText);
  }).toString()
};

