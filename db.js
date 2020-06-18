const mysql = require('mysql')
const config = require('config')

class Database {
  constructor() {
    this.connection = mysql.createConnection(config.get('mysql'))
  }

  checkInput(input, date) {
    if (!Array.isArray(input)) {
      console.error('Array expected as Input')
      return false
    }
    for (const obj of input) {
      if (!obj instanceof Object) {
        console.error('Object expected in input array')
        return false
      }
      if (!obj.hasOwnProperty('currency') || !obj.hasOwnProperty('rate')) {
        console.error('Wrong input in Object')
        return false
      }
    }
    return typeof date === 'string' && date.match(/\d{4}-\d{2}-\d{2}/g)
  }

  async sendToDb(currencies, date) {
    if (!this.checkInput(currencies, date)) {
      return
    }
    this.connection.connect()
    const promises = []
    for (const curr of currencies) {
      promises.push(
        new Promise((resolve, rej) => {
          this.connection.query(
            `INSERT IGNORE INTO currenciesjs SET date="${date}", currency="${curr.currency}", rate="${curr.rate}"`,
            (err, res, fields) => {
              if (err) {
                console.error(err)
                rej()
              } else {
                console.log(res)
                resolve()
              }
            }
          )
        })
      )
    }
    if (await Promise.allSettled(promises)) {
      this.connection.end()
    }
  }
}

module.exports = Database
