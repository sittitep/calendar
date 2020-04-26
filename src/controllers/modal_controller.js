import { Controller } from "stimulus"
import * as moment from "moment"

const clearModal = (context) => {
  let modalContent = context.element.querySelector("#modal-content")
  modalContent.innerHTML = ""
}

const buildHeader = (context, date) => {
  let modalContent = context.element.querySelector("#modal-content")
  let selectedMoment = moment(date);

  let modalHeader = document.createElement("div")
  modalHeader.id = "modal-content-header"
  modalHeader.innerHTML = selectedMoment.format("dddd, MMMM Do YYYY")

  modalContent.appendChild(modalHeader)
}

const buildBody = (context, date) => {
  let modalContent = context.element.querySelector("#modal-content")

  let modalBody = document.createElement("div")
  modalBody.id = "modal-content-body"

  let schedule = document.createElement("div")
  schedule.id = "schedule"
  schedule.dataset.controller = "schedule"
  schedule.dataset.scheduleDate = date

  modalBody.appendChild(schedule)  
  modalContent.appendChild(modalBody)
}

export default class extends Controller {
  show(date) {
    clearModal(this.context)

    buildHeader(this.context, date)
    buildBody(this.context, date)

    this.element.classList.remove("hidden")
  }

  close() {
    this.element.classList.add("hidden")
  }

  setBody(element) {
    this.element.querySelector("#modal-content").innerHTML = ''
    this.element.querySelector("#modal-content").appendChild(element)
  }
}
