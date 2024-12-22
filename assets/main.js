import '/public/assets/datastar.js'

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

export { ready, absoluteUrl }
