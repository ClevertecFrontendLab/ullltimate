module.exports = {
    root: true,
    env: { browser: true, es2020: true },
    extends: [
        require.resolve('arui-presets-lint/eslint')
    ],
    ignorePatterns: ['dist', 'coverage', '*.cjs'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        project: ['./tsconfig.eslint.json', './cypress/tsconfig.json'],
    },
    plugins: ['react-refresh'],
    overrides: [
        {
            files: ['cypress/**/*.ts'],
            rules: {
                'cypress/no-unnecessary-waiting': 'off',
            },
        },
        {
            files: ['src/redux/**/*.ts'],
            rules: {
                'no-param-reassign': 'off',
                'no-return-assign': 'off',
                'import/no-default-export': 'off',
            },
        },
    ],
    rules: {
        'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
        'import/no-absolute-path': 'off',
        'react/react-in-jsx-scope': 'off',
        'import/no-extraneous-dependencies': [
            'error',
            {
                devDependencies: ['cypress/**/*.ts', '/*.test.{ts,tsx,js,jsx}'],
            },
        ]
    },
};
