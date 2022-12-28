import Server from 'socket.io'

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.info('SOCKET', 'Server is already running')
  } else {
    console.info('SOCKET', 'Server is initializing')
    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', socket => {
      socket.on('update', () => {
        socket.broadcast.emit('update')
      })
    })
  }
  res.end()
}

export default SocketHandler
