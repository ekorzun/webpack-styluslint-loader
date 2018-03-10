# webpack-styluslint-loader
Stylus lint loader for webpack. Based on [stylint](https://simenb.github.io/stylint/).
## Installation
```
yarn add styluslint-loader -D
```

## Usage
Place `styluslint-loader` before `stylus-loader` in your webpack config. For example:
```js
{
    test: /\.styl/,
    use: [
        'css-loader',
        'stylus-loader',
        'styluslint-loader' // make sure it goes before stylus loader
    ]
}
```
