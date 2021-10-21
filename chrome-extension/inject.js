

// Extension utilities

function docLoaded(fn) {
  console.log(document.readyState)

  // see if DOM is already available
  if (document.readyState === "complete") {
      // call on next available tick
      setTimeout(fn, 1);
  } else {
      window.addEventListener("load", fn);
  }
}    


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

counter = 0
counter2 = 0

function focusButton(){
  e = document.createElement('div')
  e.style.cssText = `
    z-index: 100000;
    visibility: visible !important;
    background-color: #666;
    height: 80px;
    width: 80px;
    border-radius: 100%;
    // border-radius: 5px;
    
    color: white;
    // padding: 10px;
    position: fixed;
    // bottom: 500px;
    // right: -5px;
    bottom: -40px;
    left: -40px;

    font-family: Arial, Helvetica, sans-serif;
    font-size: large;
    text-align: center;
    // transform: rotate(-90deg);
    // transform-origin: bottom right;

    box-shadow: 0 0 15px #f9f;
    animation: 2s pulse 2;
  `

  e.innerHTML = `
    <style>
      @keyframes pulse {
        0% {
          box-shadow: 0 0 0 0 rgba(255,0,255, 0.4);
        }
        70% {
            box-shadow: 0 0 0 100px rgba(255,0,255, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(255,100,255, 0);
        }
      }
    </style>
  `
  e.onclick = () => {
    localStorage.setItem("focusExtension:enabled", "true")
    window.location.replace(window.location.href.replace("#focusExtension:deactivated", ""))
    update()
  }

  return e
}

function showPageButton(showPage=null, repeats=20){
  e = document.createElement('div')
  e.style.cssText = `
    z-index: 10000;
    visibility: visible !important;
    background-color: #555;
    // height: 40px;
    // width: 150px;
    border-radius: 5px;
    color: white;
    padding: 6px;
    position: fixed;
    bottom: 500px;
    right: -3px;
    font-family: Arial, sans-serif;
    font-size: medium;
    text-align: center;
    transform: rotate(-90deg);
    transform-origin: bottom right;
    
    box-shadow: 0 0 15px #f9f;
    user-select: none;

  `

  e.innerHTML = `Show Original Page`
  e.onclick = () => {
    // console.log("fdjkfjdkf")
    counter += 1
    e.style.background = `linear-gradient(90deg, #111 ${counter * 100 / repeats}%, #555 0%)`
    if(counter == repeats){
      if(showPage !== null){
        window.location.replace(showPage + "#focusExtension:deactivated")
      } else {
        s.innerHTML = ""
      }
    }
  }

  e2 = document.createElement('div')
  e2.style.cssText = `
    z-index: 10000;
    visibility: visible !important;
    background-color: #555;
    // height: 40px;
    // width: 200px;
    border-radius: 5px;
    color: white;
    padding: 6px;
    position: fixed;
    bottom: 300px;
    right: -3px;
    font-family: Arial, sans-serif;
    font-size: medium;
    text-align: center;
    transform: rotate(-90deg);
    transform-origin: bottom right;
  
    box-shadow: 0 0 15px #f9f;
    user-select: none;

  `

  e2.innerHTML = `Permanently Show Original Page`
  e2.onclick = () => {
    counter2 += 1
    e2.style.background = `linear-gradient(90deg, #111 ${counter2*5}%, #555 0%)`
    if(counter2 == 20){
      localStorage.setItem("focusExtension:enabled", "false")
      if(showPage !== null){
        window.location.replace(showPage)
      } else {
        update()
      }
    }
  }

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




window.addEventListener("urlchange", update)


function update() {

  counter = 0
  counter2 = 0
  s.innerHTML = ""


  enabled = (localStorage.getItem('focusExtension:enabled') || 'true') === 'true';
  console.log('focus enabled: ' + enabled)

  if(!enabled || location.hash.includes("focusExtension:deactivated")){
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

      s.appendChild(showPageButton('https://www.facebook.com'))
    } , 0)
  }


  // Twitter
  if(window.location.href === 'https://twitter.com/' || window.location.href === 'https://twitter.com/home'){
    window.location.replace('https://twitter.com/explore')
  }

  if(window.location.href === 'https://twitter.com/explore'){
    // console.log("twitter")

    setTimeout(() => {
      // s = document.createElement('style')
      s.innerHTML = `
        <style>
          * {visibility: inherit;}

          body {visibility: hidden !important;}
          
          input, header, div[role="listbox"] {visibility: visible !important;}
          form[role=search] {visibility: visible !important;}
        </style>
      `

    
      s.appendChild(showPageButton('https://twitter.com/home'))

  

    }, 0)
    focusElement('input[type=text]')
  }


  // Youtube
  if(window.location.href === 'https://www.youtube.com/'){
    window.location.replace('https://www.youtube.com/results?search_query=')
  }

  if(window.location.href === 'https://www.youtube.com/results?search_query='){

    setTimeout(() => {
      
      // s.innerHTML = `
      //   <style>
      //     :not(input || body || #show-page) {visibility: inherit;}
      //     body {visibility: hidden;}
      //     input {visibility: visible;}
      //     div[role="listbox"] {visibility: visible;}
      //   </style>
      // `
      
      s.appendChild(showPageButton('https://youtube.com'))

      focusElement('input[type=text]')


    }, 0)
  }

  if(window.location.href.split('?')[0] === 'https://www.youtube.com/watch'){
    s.appendChild(showPageButton(null, repeats=1))

    s.insertAdjacentHTML('beforeend', `
      <style>
        #related {visibility: hidden !important;}
      </style>
    `)
  }

  // console.log(location.host)
  if(location.host === 'www.youtube.com'){
    // remove subscription from sidebar
    (function check(i=0) {
      Array.from(document.querySelectorAll('ytd-guide-section-renderer')).map(e => {
        Array.from(e.querySelectorAll('h3')).map(e2 => {
          // console.log(e2)
          if(e2.innerHTML.includes('Subscriptions')){
            e.style.display = 'none'
            return
          }
        })
      })
      
      if(i < 20)
        setTimeout(check, 500, i+1)
    })()
  }




  // Instagram

  if(window.location.href === 'https://www.instagram.com/'){
    setTimeout(() => {
      
      s.innerHTML = `
        <style>
          * {visibility: inherit;}
          body {visibility: hidden !important;}
          input, .uo5MA, .MWDvN {visibility: visible !important;}
        </style>
      `
      
      s.appendChild(showPageButton('https://instagram.com'))

      focusElement('input[type=text]')

    }, 0)
    
  }

  // Reddit
  if(window.location.href === 'https://www.reddit.com/'){
    setTimeout(() => {
      
      s.innerHTML = `
        <style>
          * {visibility: inherit;}
          body {visibility: hidden !important;}
          header, div[role=menu] {visibility: visible !important;}
        </style>
      `
      
      s.appendChild(showPageButton('https://www.reddit.com'))

      focusElement('input[type=search]')

    }, 0)
    
  }


  // Facebook Messenger

  if(location.host === 'www.messenger.com' && prev_url === "" && location.hash === ""){
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
      
      s.appendChild(showPageButton('https://www.messenger.com/', repeats=1))

      focusElement('input[type=search]')

    }, 0)
  }




  // Gmail
  if(location.host === 'mail.google.com'){
    if(location.hash === ("#inbox")){
      // window.location.hash = "#search/from%3Ame+to%3Ame"
      focusElement("input[aria-label='Search mail']")
      
      s.appendChild(showPageButton(null, repeats=1))

      // s.insertAdjacentHTML('beforeend',`
      //   <style>
      //    div[role=main] {visibility: hidden;}
      //   </style>
      // `)

    }

    if(location.hash.includes("#search")){

    }

  }
    
}


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


