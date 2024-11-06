module.exports = {
  env: {
    node: true,
    jest: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  extends: ['airbnb-base', 'prettier'],
  rules: {
    'no-process-exit': 'error', // process.exit() 사용 금지
    'no-console': 'error', // console.log 사용 금지
    'import/extensions': 'off',
    'func-style': ['error', 'expression'], // 함수를 function 키워드로 선언하지 않는다.
    'max-depth': ['error', 2], // indent(인덴트, 들여쓰기) depth를 2까지만 허용한다.
    'no-ternary': 'error', // 삼항연산자를 사용하지 않는다.
    'max-lines-per-function': ['error', { max: 10, skipComments: true }], // 함수당 최대 10줄까지만 허용한다. (주석 제외)
  },
  overrides: [
    {
      files: ['__tests__/**', '*.test.js'],
      rules: {
        'max-lines-per-function': 'off',
      },
    },
  ],
};
