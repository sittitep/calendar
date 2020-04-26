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

export default class extends Controller {
  connect() {
    let options = ["11:00", "12:00"]

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
    console.log(`Send request to make a schedult at ${this.data.get("date")}@${event.target.dataset.scheduleOption}`)
    
    let message = document.createElement("div")
    message.id = "modal-content-message"
    message.innerHTML = "It's done"

    this.modalController.setBody(message)
  }

  get modalController() {
    return this.application.getControllerForElementAndIdentifier(document.querySelector("#modal"), "modal")
  }  
}
