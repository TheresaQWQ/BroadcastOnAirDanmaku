const http = require('http')
const express = require('express')
const { Server } = require("socket.io");
const bili = require('bilibili-live-ws')
const axios = require('axios').default
const danmuLogger = require('./logger')

const getArgv = (key) => {
  const argv = process.argv.slice(2)
  const index = argv.indexOf(key)
  if (index === -1) return null
  return argv[index + 1]
}

const app = express()
const server = http.createServer(app)
const io = new Server(server);

app.use('/', express.static('public'))

io.on('connection', (socket) => {
  socket.on('conn', async (room) => {
    try {
      console.log(`connecting to room ${room}`)
      const live = new bili.LiveTCP(await bili.getRoomid(Number(room)))

      live.on('DANMU_MSG', data => {
        const info = data.info;
        const username = info[2][1]
        const uid = info[2][0]
        const msg = info[1]
        
        socket.emit('msg', data)

        danmuLogger(room, `${username} (${uid})`, msg)
      })

      socket.on('disconnect', () => {
        live.close()
        console.log(`disconnected from room ${room}`)
      })

      console.log('connected to room', room)
    } catch (error) {
      socket.emit('error', error.message)
    }
  })
})

app.get('/avatar/:uid', async (req, res) => {
  try {
    const resp = await axios.get(`https://api.bilibili.com/x/web-interface/card?mid=${req.params.uid}`)
    const face = resp.data.data.card.face

    res.redirect(301, `/proxy/image?url=${encodeURIComponent(face)}`)
  } catch (error) {
    res.status(404).send('404')
  }
})

app.get('/proxy/image', async (req, res) => {
  try {
    const url = req.query.url
    const resp = await axios.get(url, {
      responseType: 'arraybuffer'
    })

    res.setHeader('Content-Type', resp.headers['content-type'])
    res.send(resp.data)
  } catch (error) {
    res.status(500).send()
  }
})

const port = Number(getArgv('--port'))

server.listen(port || 3000, () => {
  console.log(`listening on *:${port || 3000}`)
})