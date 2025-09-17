module.exports = {
  extends: ['mantine', 'plugin:storybook/recommended'],
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'import/extensions': 'off',
  },
};
