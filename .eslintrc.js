module.exports = {
    'env': {
        'commonjs': true,
        'es6': true,
        'node': true,
        'jest': true,
    },
    'extends': [
        'eslint:recommended',
        'prettier'
    ],
    'plugins': [
        'prettier'
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parserOptions': {
        'ecmaVersion': 2018
    },
    'rules': {
        'prettier/prettier': 'error'
    }
};
