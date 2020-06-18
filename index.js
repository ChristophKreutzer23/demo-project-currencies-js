const axios = require('axios')
const db = new (require('./db'))()
const Xml = require('./xml')

async function main() {
  const res = await axios.get(
    'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml'
  )
  if (res.data) {
    const parser = new Xml(res.data)
    const array = parser.getCurrencyArray(
      'elements.0.elements.2.elements.0.elements'
    )
    const date = parser.getJsonValue(
      'elements.0.elements.2.elements.0.attributes.time'
    )
    await db.sendToDb(array, date)
  }
}

main().then(console.log('done'))
