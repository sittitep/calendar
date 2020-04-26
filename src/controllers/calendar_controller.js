import { Controller } from "stimulus"
import * as moment from "moment"

import ModalController from "./modal_controller.js"

const clearCalendar = (element) => {
  element.innerHTML = ''
}

const buildCalendar = (context, selectedMoment) => {
  clearCalendar(context.element)
  buildHeader(context.element, context.data, selectedMoment)
  buildBody(context.element, context.data, selectedMoment)
}

const buildHeader = (element, data, selectedMoment) => {
  let header = document.createElement("div")
  header.id = "calendar-header"

  let headerItem = document.createElement("div")
  headerItem.className="calendar-header-item"

  let prevButton = document.createElement("i")
  prevButton.className = "fas fa-chevron-left"

  let leftItem = headerItem.cloneNode()
  leftItem.dataset.action = "click->calendar#prevMonth"
  leftItem.appendChild(prevButton)
  header.appendChild(leftItem)


  let centerItem = headerItem.cloneNode()
  centerItem.innerHTML = selectedMoment.format("MMMM YYYY")
  header.appendChild(centerItem)  

  let nextButton = document.createElement("i")
  nextButton.className = "fas fa-chevron-right"

  let rightItem = headerItem.cloneNode()
  rightItem.dataset.action = "click->calendar#nextMonth"
  rightItem.appendChild(nextButton)
  header.appendChild(rightItem)
  
  element.appendChild(header)
}

const buildBody = (element, data, selectedMoment) => {
  let index
  let dates = []

  // Add days of prev dates

  let startMonthDay = selectedMoment.clone().startOf('month')
  let prevDays = startMonthDay.weekday()

  for(prevDays; prevDays > 0; prevDays--) {
    let date = startMonthDay.clone().subtract(prevDays, "days")
    dates.push(date)
  }

  // Add current month days

  for(index = 0; index < startMonthDay.daysInMonth(); index++) {
    let date = startMonthDay.clone().add(index , "days")
    dates.push(date)
  }

  // Add days of next month

  let endMonthDay = selectedMoment.clone().endOf('month')
  let nextDays = (6 - endMonthDay.weekday())

  for(index = 0; index < nextDays; index++) {
    let date = endMonthDay.clone().add(index + 1, "days")
    dates.push(date)
  }

  let body = document.createElement("div")
  body.id = "calendar-body"

  dates.forEach(date => {
    let day = document.createElement("div")
    day.dataset.date = date.format("YYYY-MM-DD")
    day.className = "calendar-body-day"
    day.innerHTML = date.format("D")

    if(date.month() != selectedMoment.month()) {
      day.classList.add("disabled")
    }

    if(date.isSame(moment().startOf('day'))) {
      day.classList.add("current")
    }

    day.dataset.action = "click->calendar#pickDate"

    body.appendChild(day)
  })

  element.appendChild(body)
}

export default class extends Controller {
  initialize()  {
    console.log("Calendar Initialized")

    this.selectedMoment = moment()
  }

  connect() {
    buildCalendar(this.context, this.selectedMoment)
  }

  pickDate(event) {
    this.modalController.show(event.target.dataset.date)
  }

  prevMonth(event) {
    buildCalendar(this.context, this.selectedMoment.subtract(1, 'month'))
  }

  nextMonth(event) {
    buildCalendar(this.context, this.selectedMoment.add(1, 'month'))
  }

  get modalController() {
    return this.application.getControllerForElementAndIdentifier(document.querySelector("#modal"), "modal")
  }  
}
