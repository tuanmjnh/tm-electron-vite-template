declare global {
  interface Window {
    browser: any
  }
}
export default {
  get(key) {
    try {
      const rs = window.browser.storage.local.get(key)
      return rs ? JSON.parse(rs) : null
    } catch (e) { throw e; }
  },
  set(key, value) {
    try {
      window.browser.storage.local.set(JSON.stringify(value))
    } catch (e) { throw e; }
  },
  remove(key) {
    try {
      window.browser.storage.local.remove(key)
    } catch (e) { throw e; }
  },
  clear() {
    try {
      window.browser.storage.local.clear()
    } catch (e) { throw e; }
  }
}
