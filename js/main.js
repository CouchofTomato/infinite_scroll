"use strict"

const submitButton = document.getElementById('submit')
const answersDiv = document.getElementById('answers')
const searchBox = document.getElementById('search')
const BASE_URL = "https://api.stackexchange.com/2.2/questions"
const params = {
  site: "stackoverflow",
  page: 1,
  pagesize: 100,
  order: "desc",
  sort: "activity"
}

const getDocHeight = () => {
  const D = document
  return Math.max(
    D.body.scrollHeight, D.documentElement.scrollHeight,
    D.body.offsetHeight, D.documentElement.offsetHeight,
    D.body.clientHeight, D.documentElement.clientHeight
  )
}
const amountScrolled = () => {
  let winheight = window.innerHeight || (document.documentElement || document.body).clientHeight
  let docheight = getDocHeight()
  let scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop
  let trackLength = docheight - winheight
  let pctScrolled = Math.floor(scrollTop / trackLength * 100)
  return pctScrolled
}

const getURL = () => {
  let queryString =  "?".concat(Object.keys(params).map((key) => {
    return `${key}=${params[key]}`
  }).join("&"))
  return BASE_URL + queryString
}

const addResponse = (questions) => {
  questions.forEach(question => {
    let div = document.createElement('div')
    let title = document.createElement('h1')
    let questionLink = document.createElement('a')
    questionLink.href = question.link
    questionLink.innerHTML = question.title
    title.append(questionLink)
    div.append(title)
    answersDiv.appendChild(div)
  })
}

const addAnswers = () => {
  let url = getURL()
  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      addResponse(data.items)
      params.page += 1
    })
    .catch(() => {

    })
}

window.addEventListener("scroll", function() {
  let scroll = amountScrolled()
  if (scroll === 100) addAnswers()
}, false)

submitButton.addEventListener('click', (e) => {
  e.preventDefault()
  answersDiv.innerHTML = ''
  params.pages = 1
  params.tagged = searchBox.value
  addAnswers()
}, false)
