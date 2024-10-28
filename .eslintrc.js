module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'airbnb-base',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
    ],
    parserOptions: {
        ecmaVersion: '2020', // Enables parsing of ECMAScript 6 (2015) features
        sourceType: 'module' // Allows the use of ES6 modules (import/export syntax)
    },
    plugins: ['@typescript-eslint', 'prettier'],
    env: {
        es6: true,
        node: true
    },
    rules: {
        'prettier/prettier': ['error'],
        semi: 'error',
        indent: ['error', 4, { SwitchCase: 1 }],
        'no-multi-spaces': 'error',
        'space-in-parens': 'error',
        'no-multiple-empty-lines': 'error',
        'prefer-const': 'error',
        'import/prefer-default-export': 'off',
        'import/extensions': [0],
        'import/no-extraneous-dependencies': 'off'
        // Additional custom rules go here
    },
    settings: {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx']
            },
            typescript: {
                alwaysTryTypes: true
            }
        }
    }
};
