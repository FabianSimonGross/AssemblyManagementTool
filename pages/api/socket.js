import { Server } from 'socket.io'

const ioHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')
    const io = new Server(res.socket.server)

    io.on('connection', socket => {
      console.log('Connected socket.io')

      socket.on('Update Page', () => {
        socket.broadcast.emit('Update Page')
      })

      socket.on('Timer Time Change', (time) => {
        socket.broadcast.emit('Timer Time Change', time)
      })

      socket.on('Timer Time', (time) => {
        socket.broadcast.emit('Timer Time', time)
      })

      socket.on('Start Timer', () => {
        socket.broadcast.emit('Start Timer')
      })

      socket.on('Pause Timer', () => {
        socket.broadcast.emit('Pause Timer')
      })

      socket.on('Reset Timer', () => {
        socket.broadcast.emit('Reset Timer')
      })
    })

    res.socket.server.io = io
  } else {
    console.log('socket.io already running')
  }
  res.end()
}

export default ioHandler
