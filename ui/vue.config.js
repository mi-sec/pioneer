const pack = require( './package.json' );

process.env.VUE_APP_TITLE       = pack.name;
process.env.VUE_APP_DESCRIPTION = pack.description;
process.env.VUE_APP_VERSION     = pack.version;
process.env.VUE_APP_REPOSITORY  = pack.homepage;

const config = {
    productionSourceMap: process.env.NODE_ENV !== 'production',
    transpileDependencies: [
        'vuetify'
    ]
};

module.exports = config;

