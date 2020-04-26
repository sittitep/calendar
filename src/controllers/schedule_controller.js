import { Controller } from "stimulus"
import * as moment from "moment"

const setInitial = (scheduleOption) => {
  scheduleOption.classList.remove("active")
  scheduleOption.innerHTML = scheduleOption.dataset.scheduleOption
  scheduleOption.dataset.action = "click->schedule#pick"
}

const setActive = (scheduleOption) => {
  scheduleOption.classList.add("active")
  scheduleOption.dataset.action = "click->schedule#confirm"
  scheduleOption.innerHTML = "Confirm"
}

const buildOptions = (startTime, endTime, sessionDuration, restDuration) => {
  let options = []
  let startMoment = moment().hour(parseInt(startTime))
  startMoment.minutes(0)

  let endMoment = moment().hour(parseInt(endTime))
  startMoment.minutes(0)

  let totalDuration = parseInt(sessionDuration) + parseInt(restDuration)

  while(true) {
    if(startMoment.clone().add(totalDuration ,"minutes").valueOf() >= endMoment.valueOf()){
      break;
    }

    options.push(startMoment.format("HH:mm"))
    startMoment.add(totalDuration, "minutes")    
  }

  return options
}

export default class extends Controller {
  connect() {
    let paths = window.location.hash.split("/")
    paths = paths.slice(Math.max(paths.length - 2, 0))

    let timeConstraints = paths[0].split("-")

    let options = buildOptions(...timeConstraints)

    options.forEach( option => {
      let scheduleOption = document.createElement("div")
      scheduleOption.className = "schedule-option"
      scheduleOption.dataset.scheduleOption = option

      setInitial(scheduleOption)

      this.element.appendChild(scheduleOption)
    })
  }
  
  pick(event) {
    event.target.parentNode.querySelectorAll(".schedule-option").forEach(scheduleOption => {
      setInitial(scheduleOption)
    })

    setActive(event.target)
  }

  confirm(event) {
    let text = `Your schedule, ${this.data.get("date")}@${event.target.dataset.scheduleOption}, has been sent.`
    
    let message = document.createElement("div")
    message.id = "modal-content-message"
    message.innerHTML = text

    this.modalController.setBody(message)
  }

  get modalController() {
    return this.application.getControllerForElementAndIdentifier(document.querySelector("#modal"), "modal")
  }  
}
