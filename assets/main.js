import '/public/assets/alpine.min.js'
import persist from '/public/assets/alpine-persist.min.js'
import resize from '/public/assets/alpine-resize.min.js'
import '/public/assets/htmx.min.js'

function ready(callBack) {
  if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', callBack);
  }
  else {
    callBack();
  }
}

function absoluteUrl(pathname) {
    const url = new URL(window.location.href)
    url.search = ''
    url.pathname = ''
    return url.toString() + pathname.replace('/', '')
}

Alpine.plugin(persist)
Alpine.plugin(resize)

ready(() => {

})

export { ready, absoluteUrl }
