const fs = require('fs');

const danmu = (room, sender, msg) => {
  const time = new Date().toLocaleString()
  const year = new Date().getFullYear()
  const month = new Date().getMonth() + 1
  const day = new Date().getDate()
  const file = `./logs/danmu.${year}.${month}.${day}.log`

  console.log(`[${time}][${room}] ${sender} > ${msg}`);

  if (!fs.existsSync(file)) fs.writeFileSync(file, '')

  fs.appendFile(file, `[${time}][${room}] ${sender} > ${msg}\n`, (err) => {
    if (err) console.error('Error writing file', err)
  })
}

module.exports = danmu
