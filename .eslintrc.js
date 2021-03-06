module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    moment: 'readonly',
    Alice: 'readonly',
  },
  extends: [
    'plugin:unicorn/recommended',
    'plugin:sonarjs/recommended',
    'prettier',
  ],
  plugins: ['prettier', 'sonarjs', 'unicorn'],
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  rules: {
    'global-require': 0,
    // Only allow debugger in development
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // Only allow `console.log` in development
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'import/no-unresolved': 0,
    'no-unused-vars': [
      'error',
      { vars: 'all', args: 'none', ignoreRestSiblings: false },
    ],
    'no-param-reassign': [
      'error',
      {
        props: true,
        ignorePropertyModificationsFor: ['state'],
      },
    ],
    'no-underscore-dangle': 'warn',
    'sonarjs/no-identical-expressions': 'error',
    'sonarjs/no-identical-functions': 'warn',
    'sonarjs/cognitive-complexity': ['warn', 15],
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          camelCase: true,
          pascalCase: true,
        },
      },
    ],
    'unicorn/prevent-abbreviations': 'warn',
    'unicorn/no-null': 0,
  },
}
