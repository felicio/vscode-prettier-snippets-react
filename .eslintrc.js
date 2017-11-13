module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  rules: {
    quotes: ['error', 'single'],
    // semi: ['error', 'always'],
    'no-console': ['error', { allow: ['warn', 'error'] }],
  },
}
