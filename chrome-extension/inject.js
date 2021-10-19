

// Extension utilities

function focusElement(selector='input[type=text]') {
  searchFields = document.querySelectorAll(selector)
  if(searchFields.length > 0){
    ff = () => {
      searchFields[0].focus()
      searchFields[0].click()
    }
    
    setTimeout(ff, 0)
    setTimeout(ff, 200)
    setTimeout(ff, 500)
    setTimeout(ff, 1000)
    
  } else {
    setTimeout(()=>focusElement(selector), 200)
  }
}


const download = (url, path) => {
  chrome.runtime.sendMessage(message={"url": url, "filename": path})
}

function makeBlob(obj){
  // make url for object
  let json = JSON.stringify(obj, null, 2); //indentation in json format, human readable
  let blob = new Blob([json], {type: "octet/stream"})
  let info_url = window.URL.createObjectURL(blob)
  return info_url
}

function injectToDOM(fn, ...args) {
  const script = document.createElement('script')
  let argString = args.map(arg => JSON.stringify(arg)).join(', ')
  script.text = `(${fn.toString()})(${argString});`
  document.documentElement.appendChild(script)
}


function focusButton(){
  e = document.createElement('div')
  e.style.cssText = `
    z-index: 1000;
    visibility: visible !important;
    background-color: #444;
    // height: 40px;
    // width: 150px;
    border-radius: 5px;
    color: white;
    padding: 10px;
    position: fixed;
    bottom: 500px;
    right: -5px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: large;
    text-align: center;
    transform: rotate(-90deg);
    transform-origin: bottom right;

    box-shadow: 0 0 15px #f9f;

  `

  

  e.innerHTML = `Focus`
  e.onclick = () => {console.log("fdjskdfdksfj"); localStorage.setItem("focusExtension:enabled", "true"); window.location.replace("https://" + location.host);}
  return e
}

function showPageButton(showPage){
  e = document.createElement('div')
  e.style.cssText = `
    z-index: 1000;
    visibility: visible !important;
    background-color: #444;
    // height: 40px;
    // width: 150px;
    border-radius: 5px;
    color: white;
    padding: 10px;
    position: fixed;
    bottom: 500px;
    right: -5px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: large;
    text-align: center;
    transform: rotate(-90deg);
    transform-origin: bottom right;

    box-shadow: 0 0 15px #f9f;

  `

  e.innerHTML = `Show Original Page`
  e.onclick = () => {showPage()}

  e2 = document.createElement('div')
  e2.style.cssText = `
    z-index: 1000;
    visibility: visible !important;
    background-color: #444;
    // height: 40px;
    // width: 200px;
    border-radius: 5px;
    color: white;
    padding: 10px;
    position: fixed;
    bottom: 300px;
    right: -5px;
    font-family: Arial, Helvetica, sans-serif;
    font-size: large;
    text-align: center;
    transform: rotate(-90deg);
    transform-origin: bottom right;
  
    box-shadow: 0 0 15px #f9f;

  `

  e2.innerHTML = `Always Show Original Page`
  e2.onclick = () => {localStorage.setItem("focusExtension:enabled", "false"); showPage()}

  e3 = document.createElement('div')
  e3.appendChild(e)
  e3.appendChild(e2)
  return e3
}



s = document.createElement('div')

setTimeout(() => {
  if(document.body !== null){
    document.body.appendChild(s)
  } else {
    window.addEventListener('DOMContentLoaded', () => {
      document.body.appendChild(s)
    })
  }
}, 0)


function cleanup(){
  s.innerHTML = ''
}





window.addEventListener("urlchange", () => {

  enabled = (localStorage.getItem('focusExtension:enabled') || 'true') === 'true';
  console.log('focus enabled: ' + enabled)

  if(!enabled){
    s.innerHTML = ""
    s.appendChild(focusButton())
    return
  }

  // Facebook
  if(window.location.href === 'https://www.facebook.com/'){
    // console.log("bo")

    window.location.replace('https://www.facebook.com/search/')
  }

  if(window.location.href === 'https://www.facebook.com/search/'){
    setTimeout(() => {
      // s.innerHTML = `
      //   <style>
      //     :not(input || body || #show-page) {visibility: inherit;}
      //     body {visibility: hidden;}
      //     input {visibility: visible;}
      //     div[role="listbox"] {visibility: visible;}
      //   </style>
      // `
        
      focusElement('input[type=search]')

      s.appendChild(showPageButton(()=> window.location.replace('https://www.facebook.com#')))
    } , 0)
  }


  // Twitter
  if(window.location.href === 'https://twitter.com/' || window.location.href === 'https://twitter.com/home'){
    window.location.replace('https://twitter.com/explore')
  }

  else if(window.location.href === 'https://twitter.com/explore'){
    // console.log("twitter")

    setTimeout(() => {
      // s = document.createElement('style')
      s.innerHTML = `
        <style>
          :not(#show-page) {visibility: inherit;}

          body {visibility: hidden !important;}
          
          input, header, div[role="listbox"] {visibility: visible !important;}
          form[role=search] {visibility: visible !important;}
        </style>
      `

    
      s.appendChild(showPageButton(()=> window.location.replace('https://twitter.com/home#')))

  

    }, 0)
    focusElement('input[type=text]')
  }


  // Youtube
  else if(window.location.href === 'https://www.youtube.com/'){
    window.location.replace('https://www.youtube.com/results?search_query=')
  }

  else if(window.location.href === 'https://www.youtube.com/results?search_query='){

    setTimeout(() => {
      
      // s.innerHTML = `
      //   <style>
      //     :not(input || body || #show-page) {visibility: inherit;}
      //     body {visibility: hidden;}
      //     input {visibility: visible;}
      //     div[role="listbox"] {visibility: visible;}
      //   </style>
      // `
      
      s.appendChild(showPageButton(()=> window.location.replace('https://youtube.com#')))

      focusElement('input[type=text]')


    }, 0)
  }


  else if(window.location.href === 'https://www.instagram.com/'){
    setTimeout(() => {
      
      s.innerHTML = `
        <style>
          * {visibility: inherit;}
          body {visibility: hidden !important;}
          input, .uo5MA, .MWDvN {visibility: visible !important;}
        </style>
      `
      
      s.appendChild(showPageButton(()=> window.location.replace('https://instagram.com#')))

      focusElement('input[type=text]')

    }, 0)
    
  }


  else if(window.location.href === 'https://www.reddit.com/'){
    setTimeout(() => {
      
      s.innerHTML = `
        <style>
          * {visibility: inherit;}
          body {visibility: hidden !important;}
          header, div[role=menu] {visibility: visible !important;}
        </style>
      `
      
      s.appendChild(showPageButton(()=> window.location.replace('https://www.reddit.com#')))

      focusElement('input[type=search]')

    }, 0)
    
  }


  else if(location.host === 'www.messenger.com' && prev_url === "" && location.hash === ""){
  //   window.location.replace('https://www.messenger.com/t/')
  // }

  // else if(window.location.href === 'https://www.messenger.com/t/none'){
    setTimeout(() => {
      
      s.innerHTML = `
        <style>
          * {visibility: inherit;}
          body, div[role=grid] {visibility: hidden !important;}
          div[role=navigation], ul[role=listbox], input {visibility: visible !important;}
          
        </style>
      `
      
      s.appendChild(showPageButton(()=> window.location.replace('https://www.messenger.com/#_')))

      focusElement('input[type=search]')

    }, 0)
  }

  else {
    cleanup()
  }

})


prev_url = ""

function checkUrl(url = "") {
  if(url !== window.location.href){
    console.log(window.location.href + ", prev: " + url)
    prev_url = url
    url = window.location.href
    window.dispatchEvent(new Event('urlchange'))
  }
  setTimeout(checkUrl, 100, url)
}

checkUrl()


