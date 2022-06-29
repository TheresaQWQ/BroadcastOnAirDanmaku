const http = require('http')
const express = require('express')
const { Server } = require("socket.io");
const bili = require('bilibili-live-ws')
const axios = require('axios').default
const danmuLogger = require('./logger')

const app = express()
const server = http.createServer(app)
const io = new Server(server);

app.use('/', express.static('public'))

io.on('connection', (socket) => {
  socket.on('conn', (room) => {
    const live = new bili.LiveTCP(Number(room))

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
    })
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

server.listen(3000, () => {
  console.log('listening on *:3000')
})