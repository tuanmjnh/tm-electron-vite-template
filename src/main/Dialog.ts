import { dialog, ipcMain } from 'electron'

/*
const CONSTANT = {
  OPEN_DIALOG: {
    title: 'Open dialog',
    defaultPath: null,
    buttonLabel: null,
    message: null,
    securityScopedBookmarks: false,
    filters: [
      // { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
      // { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
      // { name: 'Custom File Type', extensions: ['as'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: [
      'openFile',
      'openDirectory',
      'multiSelections',
      'showHiddenFiles',
      'createDirectory',
      'promptToCreate',
      'noResolveAliases',
      'treatPackageAsDirectory',
      'dontAddToRecent'
    ]
  },
  SAVE_DIALOG: {
    title: 'Open dialog',
    defaultPath: null,
    buttonLabel: null,
    message: null,
    nameFieldLabel: null,
    showsTagField: true,
    securityScopedBookmarks: false,
    filters: [
      // { name: 'Images', extensions: ['jpg', 'png', 'gif'] },
      // { name: 'Movies', extensions: ['mkv', 'avi', 'mp4'] },
      // { name: 'Custom File Type', extensions: ['as'] },
      { name: 'All Files', extensions: ['*'] }
    ],
    properties: [
      'showHiddenFiles',
      'createDirectory',
      'treatPackageAsDirectory',
      'showOverwriteConfirmation',
      'dontAddToRecent'
    ]
  },
  MESSAGE_BOX: {
    type: 'none', //none, info, error, question or warning
    message: 'message box',
    buttons: [],
    defaultId: null,
    signal: null,
    title: 'message box title',
    detail: 'message box detail',
    checkboxLabel: '',
    checkboxChecked: null,
    icon: null,
    textWidth: null,
    cancelId: null,
    noLink: true,
    normalizeAccessKeys: false
  },
  ERROR_BOX: {
    title: 'Error',
    content: 'Error, please try again',
  },
  CERTIFICATE_TRUST: {
    browserWindow: null,
    options: {
      certificate: null,
      message: 'CertificateTrust'
    }
  }
}

ipcMain.handle('dialog', (event, arg) => {
  switch (arg.type) {
    // Default Methods
    case 'open': {
      arg = { ...CONSTANT.OPEN_DIALOG, ...arg }
      dialog.showOpenDialog(arg)
      break
    } case 'openSync': {
      arg = { ...CONSTANT.OPEN_DIALOG, ...arg }
      dialog.showOpenDialogSync(arg)
      break
    } case 'save': {
      arg = { ...CONSTANT.SAVE_DIALOG, ...arg }
      dialog.showSaveDialog(arg)
      break
    } case 'saveSync': {
      arg = { ...CONSTANT.SAVE_DIALOG, ...arg }
      dialog.showSaveDialogSync(arg)
      break
    } case 'messageBox': {
      arg = { ...CONSTANT.MESSAGE_BOX, ...arg }
      dialog.showMessageBox(arg)
      break
    } case 'messageBoxSync': {
      arg = { ...CONSTANT.MESSAGE_BOX, ...arg }
      dialog.showMessageBoxSync(arg)
      break
    } case 'errorBox': {
      arg = { ...CONSTANT.ERROR_BOX, ...arg }
      dialog.showErrorBox(arg)
      break
    } case 'certificateTrust': {
      arg = { ...CONSTANT.OPEN_DIALOG, ...arg }
      dialog.showCertificateTrustDialog(arg)
      break
    } default: {
      arg = { ...CONSTANT.MESSAGE_BOX, ...arg }
      dialog.showMessageBox(arg)
      break
    }
  }
})
*/

ipcMain.handle('dialog:open-file', (event, args) => {
  const arg = {
    title: 'Open file',
    filters: [{ name: 'All Files', extensions: ['*'] }],
    properties: ['openFile']//'multiSelections', // 'showHiddenFiles',
  } as any

  if (args.title) arg.title = args.title
  if (args.filters) arg.filters = args.filters
  if (args.multiSelections) arg.properties.push('multiSelections')
  if (args.showHiddenFiles) arg.properties.push('showHiddenFiles')

  if (args.sync) return dialog.showOpenDialogSync(arg)
  else return dialog.showOpenDialog(arg)
})

ipcMain.handle('dialog:open-folder', (event, args) => {
  const arg = {
    title: 'Open folder',
    filters: [{ name: 'All Files', extensions: ['*'] }],
    properties: ['openDirectory'] // 'multiSelections'   // 'showHiddenFiles',
  } as any

  if (args.title) arg.title = args.title
  if (args.filters) arg.filters = args.filters
  if (args.multiSelections) arg.properties.push('multiSelections')
  if (args.showHiddenFiles) arg.properties.push('showHiddenFiles')

  if (args.sync) return dialog.showOpenDialogSync(arg)
  else return dialog.showOpenDialog(arg)
})

ipcMain.handle('dialog:save-file', (event, args) => {
  const arg = {
    title: 'Save file',
    filters: [{ name: 'All Files', extensions: ['*'] }],
    // properties: [
    //   'showHiddenFiles',
    //   'createDirectory',
    //   'treatPackageAsDirectory',
    //   'showOverwriteConfirmation',
    //   'dontAddToRecent'
    // ]
  } as any

  if (args.title) arg.title = args.title
  if (args.showHiddenFiles) arg.properties.push('showHiddenFiles')
  if (args.createDirectory) arg.properties.push('createDirectory')
  if (args.treatPackageAsDirectory) arg.properties.push('treatPackageAsDirectory')
  if (args.showOverwriteConfirmation) arg.properties.push('showOverwriteConfirmation')
  if (args.dontAddToRecent) arg.properties.push('dontAddToRecent')
  if (args.filters) arg.filters = args.filters
  if (args.sync) return dialog.showSaveDialogSync(arg)
  else return dialog.showSaveDialog(arg)
})

export { }
