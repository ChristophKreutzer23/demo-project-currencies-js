const parser = require('xml-js')

class Xml {
  constructor(data) {
    this.parsed = JSON.parse(parser.xml2json(data))
  }

  getJsonValue(accessStr) {
    let res = this.parsed
    const spl = accessStr.split('.')
    for (let i = 0; i < spl.length; i++) {
      const prop = spl[i]
      res = res[spl[i]]
      if (!res) return undefined
    }
    return res
  }

  getCurrencyArray(accessStr) {
    let res = this.getJsonValue(accessStr)
    res = res.map((x) => x.attributes)
    return res
  }
}

module.exports = Xml
