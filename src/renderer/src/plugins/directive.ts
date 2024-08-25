// emits: ['update:modelValue'],
export const trim = {
  mounted(el, binding) {
    const vm = binding.instance
    el.addEventListener('keyup', (e) => {
      e.target.value = e.target.value.trim()
      vm.$emit('onUpdate:modelValue', e.target.value)
    })
  }
}

export const lowerCase = {
  // bind (el, binding, vnode) {
  // const handler = function(e) {
  //   if (e.target.value) e.target.value = e.target.value.trim()
  //   console.log(e.target.value)
  //   // if (e.target.value.length > maxChars) {
  //   // e.target.value = e.target.value.substr(0, maxChars)
  //   // vnode.elm.dispatchEvent(new CustomEvent('input')) // added this
  //   // }
  // }
  // el.addEventListener('input', handler)

  //   el.addEventListener('keyup', (e) => {
  //     if (e.target.value) {
  //       e.target.value = e.target.value.toLowerCase()
  //       vnode.componentInstance.$emit('input', e.target.value)
  //     }
  //   }, true)
  // }

  mounted(el, binding) {
    const vm = binding.instance
    el.addEventListener('keyup', (e) => {
      e.target.value = e.target.value.toLowerCase()
      vm.$emit('onUpdate:modelValue', e.target.value)
    }, true)
  }
}

export const uppercase = {
  // mounted (el, binding) {
  //   const vm = binding.instance
  //   let target = null

  //   el.addEventListener('keyup', (e) => {
  //     target = e.target
  //     e.target.value = e.target.value.toUpperCase()
  //     vm.$emit('onUpdate:modelValue', e.target.value)
  //   }, true)
  // },
  mounted(el, binding, vnode) {
    // let vm = vnode.context;
    const vm = binding.instance
    // el.dispatchEvent('update:modelValue', 'sdg')
    el.addEventListener('keyup', (e) => {
      // e.target.value = e.target.value.toUpperCase()
      // vm.$emit('update:modelValue', 'sdg')
    })
  }
}

export const upperCaseFirst = {
  mounted(el, binding) {
    const vm = binding.instance
    el.addEventListener('keyup', (e) => {
      if (e.target.value.length < 2) e.target.value = e.target.value.toUpperCase()
      else e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
      vm.$emit('update:modelValue', e.target.value)
    })
    el.addEventListener('keydown', (e) => {
      if (e.target.value.length < 2) e.target.value = e.target.value.toUpperCase()
      else e.target.value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1)
      vm.$emit('update:modelValue', e.target.value)
    })
  }
}

export const upperCaseSpace = {
  mounted(el, binding) {
    const vm = binding.instance
    el.addEventListener('keyup', (e) => {
      const arr = e.target.value.trim().split(' ')
      e.target.value = ''
      for (let i = 0; i < arr.length; i++) {
        e.target.value += arr[i].charAt(0).toUpperCase() + arr[i].slice(1)
        if (i < arr.length - 1) e.target.value += ' '
      }
      vm.$emit('onUpdate:modelValue', e.target.value)
    })
  }
}

export const focus = {
  mounted(el, binding) {
    console.log(el)
    el.focus()
  }
}

//debouncer.js
/*
  This is the typical debouncer function that receives
  the "callback" and the time it will wait to emit the event
*/
// function debouncer(fn, delay) {
//   let timeoutID
//   return () => {
//     clearTimeout(timeoutID)
//     const args = arguments
//     const that = this
//     timeoutID = setTimeout(function () {
//       fn.apply(that, args)
//     }, delay)
//   }
// }

/*
  this function receives the element where the directive
  will be set in and also the value set in it
  if the value has changed then it will rebind the event
  it has a default timeout of 500 milliseconds
*/
// export const debounce = (el, binding) => {
//   if (binding.value !== binding.oldValue) {
//     el.oninput = debouncer(function () {
//       el.dispatchEvent(new Event('change'))
//     }, parseInt(binding.value) || 500)
//   }
// }
