/* eslint-env node */
module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    'no-unused-vars': 'off', // Turn off the unused vars rule
    'vue/multi-word-component-names': 'off' // Turn off multi-word component name rule
  }
}
