const fs = require('fs')

module.exports.readFile = (path) =>  {
    return fs.readFileSync(path).toString('utf8')
}