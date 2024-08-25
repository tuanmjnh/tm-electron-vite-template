export default {
  //sync
  async getSync(key) {
    try {
      return chrome.storage.sync.get(key, (val: any) => {
        return JSON.parse(val)
      })
    } catch (e) { console.log(e) }
  },
  async setSync(obj) {
    try {
      return chrome.storage.sync.set(obj)
    } catch (e) { console.log(e) }
  },
  async removeSync(key) {
    try {
      return chrome.storage.sync.remove(key)
    } catch (e) { console.log(e) }
  },
  async clearSync() {
    try {
      return chrome.storage.sync.clear()
    } catch (e) { console.log(e) }
  },

  //session
  async getSession(key) {
    try {
      return chrome.storage.session.get(key, (val: any) => {
        return JSON.parse(val)
      })
    } catch (e) { console.log(e) }
  },
  async setSession(obj) {
    try {
      return chrome.storage.session.set(obj)
    } catch (e) { console.log(e) }
  },
  async removeSession(key) {
    try {
      return chrome.storage.session.remove(key)
    } catch (e) { console.log(e) }
  },
  async clearSession() {
    try {
      return chrome.storage.session.clear()
    } catch (e) { console.log(e) }
  },

  //local
  async get(key) {
    try {
      return chrome.storage.local.get(key)
    } catch (e) { console.log(e) }
  },
  async set(obj) {
    try {
      return chrome.storage.local.set(obj)
    } catch (e) { console.log(e) }
  },
  async remove(key) {
    try {
      return chrome.storage.local.remove(key)
    } catch (e) { console.log(e) }
  },
  async clear() {
    try {
      return chrome.storage.local.clear()
    } catch (e) { console.log(e) }
  }
}
