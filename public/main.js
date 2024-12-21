import '/public/htmx.min.js'

function ready(callBack) {
  if (document.readyState === "loading") {
    document.addEventListener('DOMContentLoaded', callBack);
  }
  else {
    callBack();
  }
}

export { ready }
