import { build, createServer } from 'vite'
import electron from 'electron'
import { spawn } from 'child_process'

const query = new URLSearchParams(import.meta.url.split('?')[1])
const debug = query.has('debug')

function watchMain(server) {
  let electronProcess = null
  const address = server.httpServer.address()
  const env = Object.assign(process.env, {
    VITE_DEV_SERVER_HOST: address.address,
    VITE_DEV_SERVER_PORT: address.port
  })
  const startElectron = {
    name: 'electron-main-watcher',
    writeBundle() {
      if(electronProcess) {
        electronProcess.removeAllListeners()
        electronProcess.kill()
      }
      electronProcess = spawn(electron, ['.'], { env })
      electronProcess.once('exit', process.exit)
      electronProcess.stdout.on('data', (data)=> {
        const str = data.toString().trim()
        str && console.log(str)
      })
      electronProcess.stderr.on('data', (data)=> {
        const str = data.toString().trim()
        str && console.log(str)
      })

    }
  }
  return build({
    configFile: 'packages/main/vite.config.ts',
    mode: 'development',
    plugins: [startElectron],
    build: {
      watch: {},
    },
  })
}
function watchPreload(server) {
  return build({
    configFile: 'packages/preload/vite.config.ts',
    mode: 'development',
    plugins: [{
      name: 'electron-preload-watcher',
      writeBundle() {
        // clearConsole()
        server.ws.send({ type: 'full-reload' })
      },
    }],
    build: {
      watch: {},
    },
  })
}
const server = await createServer({
  configFile: 'packages/renderer/vite.config.ts'
})
await server.listen()
await watchMain(server)
await watchPreload(server)

