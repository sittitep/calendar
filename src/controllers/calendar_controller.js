import { Controller } from "stimulus"
import * as moment from "moment"

const buildCalendar = (controller, selectedMoment) => {
  buildHeader(controller.element, controller.data, selectedMoment)
  buildBody(controller.element, controller.data, selectedMoment)
}

const buildHeader = (element, data, selectedMoment) => {
  let header = document.createElement("div")
  header.id = "calendar-header"
  header.innerHTML = selectedMoment.format("MMMM YYYY")

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

    if(date.isSame(selectedMoment.clone().startOf('day'))) {
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

    // Set selected month
    this.data.set("selectedYear", 2020)
    this.data.set("selectedMonth", 4)
  }

  connect() {
    let selectedMoment = moment()
    buildCalendar(this, selectedMoment)
  }

  pickDate(event) {
    console.log(event.target.dataset.date)
  }
}
