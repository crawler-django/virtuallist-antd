module.exports = {
    env: {
        browser: true,
        es2020: true,
        jest: true,
    },
    globals: {
        JSX: true,
        jsdom: true,
    },
    extends: ['plugin:react/recommended', 'airbnb'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 11,
        sourceType: 'module',
    },
    plugins: ['react', 'react-hooks', '@typescript-eslint'],
    rules: {
        'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
        'react-hooks/exhaustive-deps': 'warn',
        'react/jsx-filename-extension': [
            2,
            { extensions: ['.js', '.jsx', '.ts', '.tsx'] },
        ],
        'react/jsx-props-no-spreading': 'off',
        'no-use-before-define': 'off',
        camelcase: 'off',
        'no-bitwise': 'off',
        'no-underscore-dangle': 'off',
        'jsx-a11y/anchor-is-valid': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/click-events-have-key-events': 'off',
        'import/extensions': 'off',
        'import/no-unresolved': 'off',
        'import/no-extraneous-dependencies': 'off',
        '@typescript-eslint/no-use-before-define': ['error'],
        indent: 'off',
        'react/jsx-indent': 'off',
        semi: 'off',
        'react/jsx-indent-props': 'off',
        'implicit-arrow-linebreak': 'off',
        'comma-dangle': 'off',
    },
}
