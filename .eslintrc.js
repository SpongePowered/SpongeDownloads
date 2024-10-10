module.exports = {
  root: true,
  env: {
    node: true
  },
  files: ['*.js', '*.vue'],
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-unused-vars': ["error", { "varsIgnorePattern": "[iI]gnored" }],
    'vue/multi-word-component-names': 'off',
    'vue/no-reserved-component-names': 'off'
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
};
