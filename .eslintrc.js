module.exports = {
  extends: [
    'airbnb-base',
    'plugin:react/recommended',
  ],
  plugins: [
    'react',
  ],
  env: {
    'jest': true
  },
  globals: {
    'test': true,
    'expect': true,
    'document': true,
    'window': true,
    // Globals introduced by `jsx-control-statements`:
    'If': true,
    'Otherwise': true,
    'When': true,
    'Choose': true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaFeatures: {
      classes: true,
      jsx: true,
    },
  },
  rules: {
    'indent': ["warn", 4, {
         SwitchCase: 1
    }],
    // eslint does not like babel module resolver
    'import/no-unresolved': 0,
    'import/extensions': ["js"],
    'import/prefer-default-export': 'off',
    'no-console': ["error", { allow: ["warn", "error"] }],
    // so we can mutate accumulators in reducers as usual
    'no-param-reassign': ["error", { "props": false }],
    'max-len': ["error", { "code": 140 }],
    'no-use-before-define': ["error", { "functions": false, "classes": true }],
     'comma-dangle': ["error", {
        "arrays": "never",
        "objects": "never",
        "imports": "never",
        "exports": "never",
        "functions": "ignore"
    }],
    'semi': 0,
    'class-methods-use-this': 0,
    'consistent-return': 0,
    'react/jsx-no-undef': [0, {
      'allowGlobals': true,
    }],
  },
}