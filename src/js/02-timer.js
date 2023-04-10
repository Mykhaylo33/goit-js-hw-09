import flatpickr from 'flatpickr';
import Notiflix from 'notiflix';

import 'flatpickr/dist/flatpickr.min.css';

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
      setTimeout(() => Notiflix.Notify.failure('Please choose a date in the future'), 10);
    }
  },
};

const addLeadingZero = (value) => String(value).padStart(2, '0');

const convertMs = (ms) => {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
};

const startTimer = () => {
  if (rfs.intervalId) {
    clearInterval(rfs.intervalId);
  }
  rfs.decrementTimeValue = rfs.chosenFutureDateTimeValue - new Date();
  rfs.intervalId = setInterval(updateTime, 1000);
};

const updateTime = () => {
  render(convertMs(rfs.decrementTimeValue));
  rfs.decrementTimeValue -= 1000;
};

const render = ({ days = 0, hours = 0, minutes = 0, seconds }) => {
  rfs.printDaysEl.textContent = addLeadingZero(days);
  rfs.printHoursEl.textContent = addLeadingZero(hours);
  rfs.printMinutesEl.textContent = addLeadingZero(minutes);
  rfs.printSecondsEl.textContent = addLeadingZero(seconds);
};

const isBtnStartValid = () => {
  rfs.currentDateTimeValue = new Date();
  rfs.deltaTimeValue = rfs.chosenFutureDateTimeValue - rfs.currentDateTimeValue;
  rfs.btnStartEnable = rfs.deltaTimeValue <= 0;
  rfs.btnStartEl.disabled = rfs.btnStartEnable;
  return rfs.btnStartEnable;
};

const btnStartSwitchOff = () => rfs.btnStartEl.disabled = true;

const onBtnStartHandler = () => {
  btnStartSwitchOff();
  startTimer();
};

Notiflix.Notify.init({
  timeout: 2500,
  clickToClose: true,
});

rfs.btnStartEl.addEventListener('click', onBtnStartHandler);
flatpickr(rfs.dateTimePickerEl, options);

btnStartSwitchOff();
