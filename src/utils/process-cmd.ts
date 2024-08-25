const spawn = require("child_process").spawn
export const RunCMD = () => {
  try {
    const bat = spawn("cmd.exe", [
      "/c",          // Argument for cmd.exe to carry out the specified script
      "D:\test.bat", // Path to your file
      "argument1",   // First argument
      "argumentN"    // n-th argument
    ])

    bat.stdout.on("data", (data) => {
      // Handle data...
    })

    bat.stderr.on("data", (err) => {
      // Handle error...
    })

    bat.on("exit", (code) => {
      // Handle exit
    })
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

export const RunExecFile = (fileExe: string, args: Array<string>) => {
  try {
    const { execFile } = require('node:child_process')
    const child = execFile(fileExe, args, (error, stdout, stderr) => {
      if (error) {
        throw error
      }
      console.log(stdout)
    })
    // const child = execFile('node', ['--version'], (error: any, stdout: any, stderr: any) => {
    //   if (error) throw error
    //   console.log(stdout, stderr)
    // })
    console.log(child)
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}

export const RunExec = (fileExe: string, args?: string, cb?) => {
  try {
    return new Promise(resolve => {
      const { exec } = require('node:child_process')
      // exec('"/path/to/test file/test.sh" arg1 arg2')
      exec(`${fileExe} ${args}`, (error, stdout, stderr) => {
        // console.log('error', error)
        // console.log('stdout', stdout)
        // console.log('stderr', stderr)
        // console.log(`${fileExe} ${args}`)
        if (cb) cb(stdout)
        resolve(stdout)
      })
    })
  } catch (e) {
    // console.log(e)
    return false
  }
}

export const CheckProcess = (query: string, cb?) => {
  try {
    const { exec } = require('node:child_process')
    const platform = process.platform
    let cmd = ''
    switch (platform) {
      case 'win32': cmd = `tasklist`; break
      case 'darwin': cmd = `ps -ax | grep ${query}`; break
      case 'linux': cmd = `ps -A`; break
      default: break
    }
    exec(cmd, (err, stdout, stderr) => {
      console.log(stdout)
      if (cb) cb(stdout.toLowerCase().indexOf(query.toLowerCase()) > -1)
      return true
    })
    return true
  } catch (e) {
    console.log(e)
    return false
  }
}
