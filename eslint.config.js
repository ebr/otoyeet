import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2023,
            sourceType: 'module',
            globals: {
                ...globals.es2021,
                global: 'readonly',
            },
        },
        rules: {
            'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
            'eqeqeq': 'error',
            'no-var': 'error',
            'prefer-const': 'error',
            'no-throw-literal': 'error',
        },
    },
];
