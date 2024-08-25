export const detectBrowserMode = (className = 'DivBrowserModeContainer', role = '[role="dialog"]') => {
  const reg = new RegExp("(.*)" + className + "(.*)")
  const el = document.querySelectorAll(role)
  console.log(el)
  if (el.length < 1) return false
  for (let i = 0; i < el.length; i++) {
    if (reg.test(el[i].className)) {
      return true
    }
  }
  return false
}

export const actionsTest = async (args) => {
  try {
    return new Promise(resolve => {
      // var els = document.querySelectorAll('[data-e2e="recommend-list-item-container"]')
      // // els[5].scrollIntoView()
      // var elLikeFeed = els[3].querySelector(options.el.feed)
      // if (elLikeFeed.parentElement.nodeName.toLowerCase() === 'button') elLikeFeed.parentElement.click()
      // else elLikeFeed.click()


      // console.log(document.body.scrollHeight)
      // document.documentElement.scrollLeft
      // document.documentElement.scrollTop
      // var el = document.getElementById('main-content-homepage_hot')
      // console.log(elLikeFeed.parentNode, elLikeFeed.parentElement)
      // var elBrowse = document.getElementsByClassName(browse)

      // var elBrowse = findElements(browse)
      // console.log(elBrowse)
      // console.log(document.getElementsByRegex('class', new RegExp("(.*)" + browse + "(.*)")));


      // var els = document.querySelectorAll('[data-e2e="video-play"]')
      // console.log(els[3])
      // els[3].click()
      console.log(args)
      const reg = new RegExp("(.*)" + args.text + "(.*)")
      console.log(reg)
      const els = document.querySelectorAll(args.parent)
      // console.log(els)
      els[2].click()
      setTimeout(() => {
        const el = document.querySelector(args.el)
        const spans = el.querySelectorAll('span')
        spans.forEach(e => {
          if (reg.test(e.textContent))
            console.log(e.click())
        })
        // var follow = el.querySelector('[textContent*="Follow"]')
        // console.log(follow)
        resolve(true)
      }, 1000)
    })
  } catch (e) {
    console.log(e)
    return false
  }
}

export const actionClick = async (type, args, timeout) => {
  try {
    return new Promise(resolve => {
      let isClicked = false
      const els = document.querySelectorAll(args.el)
      if (els.length < 1) {
        console.log(`Can't find any element - ${args.el}`)
        return resolve(isClicked)
      }
      const rdEl = Math.floor(Math.random() * els.length)
      // console.log(`Run ${type}: ${rdEl} of ${els.length} - timeout: ${Math.floor(timeout / 1000)}s - ${el}`)
      if (els[rdEl]) {
        const to = setTimeout((y) => {
          els[rdEl].click()
          isClicked = true
          console.log(`[${to}]Clicked ${type}: ${rdEl} of ${els.length} - timeout: ${Math.floor(timeout / 1000)}s`)
          // console.log(`Index ${rdEl} clicked - Id ${to}: done`)
          clearTimeout(to)
          return resolve(isClicked)
        }, timeout) // we're passing x
      } else {
        console.log(`Can't find any element - ${args.el} - index ${rdEl}}`)
        return resolve(isClicked)
      }
    })
  } catch (e) {
    console.log(e)
    return false
  }
}

export const actionClickChild = async (type, args, timeout) => {
  try {
    return new Promise(resolve => {
      let isClicked = false
      const els = document.querySelectorAll(args.parent)
      if (els.length < 1) {
        console.log(`Can't find any element - ${args.parent}`)
        return resolve(isClicked)
      }
      const rdEl = Math.floor(Math.random() * els.length)
      // console.log(`Run ${type}: ${rdEl} of ${els.length} - timeout: ${Math.floor(timeout / 1000)}s - ${el}`)
      if (els[rdEl]) {
        const to = setTimeout((y) => {
          // console.log("%d => %d", y, list[y] += 10)
          els[rdEl].click()
          setTimeout(() => {
            const el = document.querySelectorAll(args.el)
            if (el.length > 0) {
              el[0].click()
              isClicked = true
              console.log(`[${to}]Clicked ${type}: ${rdEl} of ${els.length} - timeout: ${Math.floor(timeout / 1000)}s`)
            }
            else {
              els[rdEl].click()
              console.log(`Can't find any element - ${args.el} - index ${rdEl}}`)
            }
            clearTimeout(to)
            return resolve(isClicked)
            // console.log(`Index ${rdEl} clicked - Id ${to}: done`)
          }, 1000)
        }, timeout) // we're passing x
      } else {
        console.log(`Can't find any element - ${args.el} - index ${rdEl}}`)
        return resolve(isClicked)
      }
    })
  } catch (e) {
    console.log(e)
    return false
  }
}

export const actionClickChildIndex = async (type, args, timeout) => {
  try {
    return new Promise(resolve => {
      let isClicked = false
      const els = document.querySelectorAll(args.parent)
      if (els.length < 1) {
        console.log(`Can't find any element - ${args.parent}`)
        return resolve(isClicked)
      }
      const rdEl = Math.floor(Math.random() * els.length)
      // console.log(`Run ${type}: ${rdEl} of ${els.length} - timeout: ${Math.floor(timeout / 1000)}s - ${el}`)
      if (els[rdEl]) {
        const to = setTimeout((y) => {
          // console.log("%d => %d", y, list[y] += 10)
          els[rdEl].click()
          setTimeout(() => {
            const el = document.querySelectorAll(args.el)
            if (el && el.length > 0) {
              isClicked = true
              el[0].children[args.index].click()
              console.log(`[${to}]Clicked ${type}: ${rdEl} of ${els.length} - timeout: ${Math.floor(timeout / 1000)}s`)
            }
            else {
              console.log(`Can't find any element - ${args.el} - index ${rdEl}}`)
              els[rdEl].click()
            }
            clearTimeout(to)
            // console.log(`Index ${rdEl} clicked - Id ${to}: done`)
            return resolve(isClicked)
          }, 1000)
        }, timeout) // we're passing x
      } else {
        console.log(`Can't find any element - ${args.el} - index ${rdEl}}`)
        return resolve(isClicked)
      }
    })
  } catch (e) {
    console.log(e)
    return false
  }
}

export const actionClickChildFind = async (type, args, timeout) => {
  try {
    return new Promise(resolve => {
      let isClicked = false
      const reg = new RegExp("(.*)" + args.text + "(.*)")
      const els = document.querySelectorAll(args.parent)
      if (els.length < 1) {
        console.log(`Can't find any element - ${args.parent}`)
        return resolve(isClicked)
      }
      const rdEl = Math.floor(Math.random() * els.length)
      // console.log(`Run ${type}: ${rdEl} of ${els.length} - timeout: ${Math.floor(timeout / 1000)}s - ${el}`)
      const to = setTimeout((y) => {
        // console.log("%d => %d", y, list[y] += 10)
        els[rdEl].click()
        setTimeout(() => {
          const el = document.querySelector(args.el)
          if (el) {
            const spans = el.querySelectorAll('span')
            for (let i = 0; i < spans.length; i++) {
              if (reg.test(spans[i].textContent)) {
                spans[i].click()
                isClicked = true
                console.log(`[${to}]Clicked ${type}: ${rdEl} of ${els.length} - timeout: ${Math.floor(timeout / 1000)}s`)
                break
              }
            }
            if (!isClicked) {
              console.log(`Can't find any element - ${args.text} - index ${rdEl}}`)
              els[rdEl].click()
            }
          } else {
            console.log(`Can't find any element - ${args.el} - index ${rdEl}}`)
            els[rdEl].click()
          }
          // console.log(`Index ${rdEl} clicked - Id ${to}: done`)
          clearTimeout(to)
          return resolve(isClicked)
        }, 1000)
      }, timeout) // we're passing x
    })
  } catch (e) {
    console.log(e)
    return false
  }
}

//Tiktok Browse shareEmbed
export const actionClickModalButton = async (type, args, timeout) => {
  try {
    return new Promise(resolve => {
      let isClicked = false
      const els = document.querySelectorAll(args.el)
      if (els.length < 1) {
        console.log(`Can't find any element - ${args.el}`)
        return resolve(isClicked)
      }
      const rdEl = Math.floor(Math.random() * els.length)
      const to = setTimeout((y) => {
        els[rdEl].click()
        setTimeout(() => {
          const modal = document.getElementById('login-modal')
          if (modal) {
            const button = modal.querySelector('button')
            if (button) {
              button.click()
              isClicked = true
              console.log(`[${to}]Clicked ${type}: ${rdEl} of ${els.length} - timeout: ${Math.floor(timeout / 1000)}s`)
            } else {
              els[rdEl].click()
              console.log(`Can't find any element - button - index ${rdEl}}`)
            }
            clearTimeout(to)
            return resolve(isClicked)
          } else {
            console.log(`Can't find any element - modal - index ${rdEl}}`)
            els[rdEl].click()
            clearTimeout(to)
            return resolve(isClicked)
          }
        }, 1000)
      }, timeout) // we're passing x
    })
  } catch (e) {
    console.log(e)
    return false
  }
}

//Tiktok Feed shareEmbed
export const actionClickChildModalButton = async (type, args, timeout) => {
  try {
    return new Promise(resolve => {
      let isClicked = false
      const els = document.querySelectorAll(args.parent)
      if (els.length < 1) {
        console.log(`Can't find any element - ${args.parent}`)
        return resolve(isClicked)
      }
      const rdEl = Math.floor(Math.random() * els.length)
      const to = setTimeout((y) => {
        els[rdEl].click()
        setTimeout(() => {
          const el = document.querySelector(args.el)
          if (el) {
            el.click()
            setTimeout(() => {
              const modal = document.getElementById('login-modal')
              if (modal) {
                const button = modal.querySelector('button')
                if (button) {
                  button.click()
                  isClicked = true
                  console.log(`[${to}]Clicked ${type}: ${rdEl} of ${els.length} - timeout: ${Math.floor(timeout / 1000)}s`)
                } else {
                  els[rdEl].click()
                  console.log(`Can't find any element - button - index ${rdEl}}`)
                }
              } else {
                els[rdEl].click()
                console.log(`Can't find any element - modal - index ${rdEl}}`)
              }
              clearTimeout(to)
              return resolve(isClicked)
            }, 1000)
          } else {
            console.log(`Can't find any element - ${args.el} - index ${rdEl}}`)
            els[rdEl].click()
            clearTimeout(to)
            return resolve(isClicked)
          }
        }, 1000)
      }, timeout) // we're passing x
    })
  } catch (e) {
    console.log(e)
    return false
  }
}

// export { actionClick, actionClickChild, actionClickChildIndex, actionClickChildFind, actionClickModalButton, actionClickChildModalButton, detectBrowserMode, actionsTest }
