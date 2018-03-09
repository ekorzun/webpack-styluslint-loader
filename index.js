'use strict'
const fs = require('fs')
const path = require('path')
const stylint = require('stylint')

function lint(source, webpack, callback) {
  stylint(source, lint.config)
    .methods({
      read() {
        this.cache.files = [webpack.resource]
        this.parse(null, [source])
      },
      done() {
        const { cache } = this
        const { errs, warnings, msg } = cache
        if (errs.length || warnings.length) {
          if (!this.state.quiet) {
            const message = [].concat(errs, warnings, msg).join('\n')
            const emitter = errs.length ? webpack.emitError : webpack.emitWarning
            try {
              emitter(new Error(message))
            } catch (e) {
              throw new Error(message)
            }
          } else {
            throw new Error(`
              Module failed because of a stylint ${errs.length ? 'error' : 'warning'}:
              ${msg}
            `)
          }
        }
        this.resetOnChange()
      }
    })
    .create({}, {})

  if (callback) {
    callback(null, source)
  }
}

lint.config = null

module.exports = function (source) {
  if (!lint.config) {
    const { context } = this
    if (fs.existsSync(path.resolve(context, '.stylintrc'))) {
      lint.config = JSON.parse(fs.readFileSync(path.resolve(context, '.stylintrc')))
    }
    if (fs.existsSync(path.resolve(context, 'package.json'))) {
      const pkg = require(path.resolve(context, 'package.json'))
      if (pkg.stylint) {
        if (typeof pkg.stylint === 'string') {
          try {
            lint.config = JSON.parse(fs.readFileSync(path.resolve(context, pkg.stylint)))
          } catch (e) {
            throw new Error(`Error in package.json`)
          }
        } else if (typeof pkg.stylint === 'object') {
          lint.config = Object.assign({}, lint.config || {}, pkg.stylint)
        }
      }
    }

    if (!lint.config) {
      lint.config = JSON.parse(fs.readFileSync(path.resolve(__dirname, '.stylintrc')))
    }
  }

  const callback = this.async()
  this.cacheable && this.cacheable()

  if (!callback) {
    lint(source, this)
    return source
  }

  try {
    lint(source, this, callback)
  } catch (error) {
    callback(error)
  }
}