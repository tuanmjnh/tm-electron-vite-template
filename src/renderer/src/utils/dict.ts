import { fetchDictList } from '@/service'
import { DictMap } from '@/typings/global'
import { session } from '@/utils'

export const dictMap: DictMap = {}

/**
* Get the dictionary object corresponding to the given code
*
* @param code - dictionary code
* @return an object containing a list of dictionaries, a dictionary of value mappings, and a dictionary of label mappings
*/
export async function dict(code: string) {
  const targetDict = await getDict(code)

  return {
    data: () => targetDict,
    enum: () => Object.fromEntries(targetDict.map(({ value, label }) => [value, label])),
    valueMap: () => Object.fromEntries(targetDict.map(({ value, ...data }) => [value, data])),
    labelMap: () => Object.fromEntries(targetDict.map(({ label, ...data }) => [label, data])),
  }
}

/**
* Get dictionary data based on dictionary code
* If there is a local cache, return the cached data, otherwise get the data through the network request
*
* @param code - dictionary code
* @return dictionary data
*/
export async function getDict(code: string) {
  const isExist = Reflect.has(dictMap, code)

  if (isExist) {
    return dictMap[code]
  }
  else {
    return await getDictByNet(code)
  }
}

/**
* Get dictionary data through network request
*
* @param code - dictionary code
* @return dictionary data
*/
export async function getDictByNet(code: string) {
  const { data, isSuccess } = await fetchDictList(code)
  if (isSuccess) {
    Reflect.set(dictMap, code, data)
    // Synchronize to session
    session.set('dict', dictMap)
    return data
  } else { throw new Error(`Failed to get ${code} dictionary from network, check ${code} field or network`) }
} function initDict() {
  const dict = session.get('dict')
  if (dict) { Object.assign(dictMap, dict) }
} initDict()
