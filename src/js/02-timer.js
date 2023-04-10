import flatpickr from 'flatpickr';
import Notiflix from 'notiflix';

// Додатковий імпорт стилів
import 'flatpickr/dist/flatpickr.min.css';

Notiflix.Notify.init({
  timeout: 2500,
  clickToClose: true,
});

const rfs = {
  printDaysEl: document.querySelector('[data-days]'),
  printHoursEl: document.querySelector('[data-hours]'),
  printMinutesEl: document.querySelector('[data-minutes]'),
  printSecondsEl: document.querySelector('[data-seconds]'),
  btnStartEl: document.querySelector('[data-start]'),
  btnStartEnable: false,
  dateTimePickerEl: document.querySelector('#datetime-picker'),
  chosenFutureDateTimeValue: null,
  currentDateTimeValue: null,
  deltaTimeValue: null,
  decrementTimeValue: null,
  intervalId: null,
};

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    rfs.chosenFutureDateTimeValue = selectedDates[0];
    if (isBtnStartValid()) {
      setTimeout(attentionText, 10);
    }
  },
};

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function onBtnStartHandler() {
  btnStartSwitchOff();
  startTimer();
}

function startTimer() {
  if (rfs.intervalId) {
    clearInterval(rfs.intervalId);
  }
  rfs.decrementTimeValue = rfs.chosenFutureDateTimeValue - new Date();
  rfs.intervalId = setInterval(() => {
    updateTime();
  }, 1000);
}

function updateTime() {
  render(convertMs(rfs.decrementTimeValue));
  rfs.decrementTimeValue -= 1000;
}

function render({ days = 0, hours = 0, minutes = 0, seconds }) {
  rfs.printDaysEl.textContent = addLeadingZero(days);
  rfs.printHoursEl.textContent = addLeadingZero(hours);
  rfs.printMinutesEl.textContent = addLeadingZero(minutes);
  rfs.printSecondsEl.textContent = addLeadingZero(seconds);
}

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function isBtnStartValid() {
  rfs.currentDateTimeValue = new Date();
  rfs.deltaTimeValue = rfs.chosenFutureDateTimeValue - rfs.currentDateTimeValue;
  rfs.deltaTimeValue > 0
    ? (rfs.btnStartEnable = false)
    : (rfs.btnStartEnable = true);
  rfs.btnStartEl.disabled = rfs.btnStartEnable;
  return rfs.btnStartEnable;
}

function btnStartSwitchOff() {
  rfs.btnStartEl.disabled = true;
}

function attentionText() {
  Notiflix.Notify.failure('Please choose a date in the future');
}

function attentionConsoleText(text) {
  console.log(text);
}

rfs.btnStartEl.addEventListener('click', onBtnStartHandler);
flatpickr(rfs.dateTimePickerEl, options);

btnStartSwitchOff();