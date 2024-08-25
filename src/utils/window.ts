export const setWindowSize = (element = 'app', fixWidth = 17, fixHeight = 16) => {
  const el = document.querySelector(element) as HTMLElement
  if (el) {
    el.style.width = `${window.innerWidth - fixWidth}px`
    el.style.height = `${window.innerHeight - fixHeight}px`
  }
}
