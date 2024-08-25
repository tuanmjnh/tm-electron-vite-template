const STORAGE_PREFIX = import.meta.env.RENDERER_VITE_STORAGE_PREFIX
import { Storage } from '@/typings/global'

interface StorageData<T> {
  value: T
  expire: number | null
}
/**
 * LocalStorage Partial Operations
 */
function createLocalStorage<T extends Storage.Local>() {
  // The default cache period is 7 days

  function set<K extends keyof T>(key: K, value: T[K], expire: number = 60 * 60 * 24 * 7) {
    const storageData: StorageData<T[K]> = {
      value,
      expire: new Date().getTime() + expire * 1000,
    }
    const json = JSON.stringify(storageData)
    window.localStorage.setItem(`${STORAGE_PREFIX}${String(key)}`, json)
  }

  function get<K extends keyof T>(key: K) {
    const json = window.localStorage.getItem(`${STORAGE_PREFIX}${String(key)}`)
    if (!json)
      return null

    const storageData: StorageData<T[K]> | null = JSON.parse(json)

    if (storageData) {
      const { value, expire } = storageData
      if (expire === null || expire >= Date.now())
        return value
    }
    remove(key)
    return null
  }

  function remove(key: keyof T) {
    window.localStorage.removeItem(`${STORAGE_PREFIX}${String(key)}`)
  }

  function clear() {
    window.localStorage.clear()
  }
  return {
    set,
    get,
    remove,
    clear,
  }
}
/**
 * Some operations of sessionStorage
 */

function createSessionStorage<T extends Storage.Session>() {
  function set<K extends keyof T>(key: K, value: T[K]) {
    const json = JSON.stringify(value)
    window.sessionStorage.setItem(`${STORAGE_PREFIX}${String(key)}`, json)
  }
  function get<K extends keyof T>(key: K) {
    const json = sessionStorage.getItem(`${STORAGE_PREFIX}${String(key)}`)
    if (!json)
      return null

    const storageData: T[K] | null = JSON.parse(json)

    if (storageData)
      return storageData

    return null
  }
  function remove(key: keyof T) {
    window.sessionStorage.removeItem(`${STORAGE_PREFIX}${String(key)}`)
  }
  function clear() {
    window.sessionStorage.clear()
  }

  return {
    set,
    get,
    remove,
    clear,
  }
}

export const local = createLocalStorage()
export const session = createSessionStorage()
