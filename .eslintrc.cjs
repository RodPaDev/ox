module.exports = {
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended'
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'comma-dangle': 2,
    quotes: [2, 'single'],
    'no-undef': 2,
    'global-strict': 0,
    'no-extra-semi': 1,
    'no-underscore-dangle': 0,
    'no-console': 1,
    '@typescript-eslint/no-unused-vars': [
      1,
      {
        argsIgnorePattern: '[parent|options]'
      }
    ],
    'no-trailing-spaces': [
      2,
      {
        skipBlankLines: true
      }
    ],
    'no-unreachable': 2,
    'no-alert': 0
  }
}
