const path = require('path');
const sharedConfigAbsolute = path.join(__dirname,
    '..', 'build_tools', 'profiles', 'common', 'shared.config.js');

module.exports = {
    settings: {
        'import/resolver': {
            webpack: {
                config: sharedConfigAbsolute,
            },
        },
    },
}