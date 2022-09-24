import Server from 'socket.io'

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.info('SOCKET', 'Server is already running')
  } else {
    console.info('SOCKET', 'Server is initializing')
    const server = new Server(res.socket.server)
    res.socket.server.io = server
  }
  res.end()
}

export default SocketHandler
