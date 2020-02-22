import { writable } from 'svelte/store'
import { get } from 'svelte/store'

function createStore(name, defaultState) {
  const initialState = GM_getValue(name, defaultState)
  const store = writable(initialState)
  const { subscribe, set } = store

  return {
    subscribe,
    set: new_store => {
      GM_setValue(name, new_store)
      return set(new_store)
    },
  }
}

export const salary = createStore('salary', {
  enable: true,
  lower: 12,
  upper: 20,
})

function createList(name, defaultState=[]) {
  const initialState = GM_getValue(name, defaultState)
  const store = writable(initialState)
  const { subscribe, set, update } = store

  return {
    subscribe,
    add: item => {
      return update(list => {
        const newList = [...list, item]
        GM_setValue(name, newList)
        return newList
      })
    },
    del: item => {
      return update(list => {
        const index = list.indexOf(item)
        if (index > -1) {
          list.splice(index, 1)
          GM_setValue(name, list)
        }
        return list
      })
    },
    set: (newList = []) => {
      GM_setValue(name, newList)
      return set(newList)
    },
    in: item => {
      return get(store).indexOf(item) > -1
    },
  }
}

export const blacklist = createList('blacklist')
export const whitelist = createList('whitelist')
export const lowlist = createList('lowlist')


