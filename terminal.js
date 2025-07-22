const { spawn } = require('child_process')
const os = require('os')

class TerminalCore {
  constructor() {
    this.sessions = new Map()
  }

  createSession(sessionId) {
    const shell = os.platform() === 'win32' ? 'cmd.exe' : 'bash'
    const session = spawn(shell, [], {
      cwd: os.homedir()
    })
    
    this.sessions.set(sessionId, session)
    return session
  }

  executeCommand(sessionId, command) {
    return new Promise((resolve) => {
      const session = this.sessions.get(sessionId)
      let output = ''
      
      session.stdout.on('data', (data) => {
        output += data.toString()
      })
      
      session.on('close', () => {
        resolve(output)
      })
      
      session.stdin.write(`${command}\n`)
    })
  }
}

module.exports = TerminalCore