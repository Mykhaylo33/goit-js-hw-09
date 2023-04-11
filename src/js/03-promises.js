import Notiflix from 'notiflix';

Notiflix.Notify.init({
  timeout: 4000,
  clickToClose: true,
});

const rfs = {
  inputDelayEl: document.querySelector('[name="delay"]'),
  inputStepEl: document.querySelector('[name="step"]'),
  inputAmountEl: document.querySelector('[name="amount"]'),
  btnSubmitEl: document.querySelector('button'),
};

rfs.btnSubmitEl.addEventListener('click', onSubmitClickHandler);

function onSubmitClickHandler(e) {
  e.preventDefault();

  const promiseArray = createPromiseArray(
    Number(rfs.inputAmountEl.value),
    Number(rfs.inputDelayEl.value),
    Number(rfs.inputStepEl.value)
  );

  handlePromiseArray(promiseArray);
}

function createPromise(position, delay) {
  const shouldResolve = Math.random() > 0.3;

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldResolve) {
        resolve(`✅ Fulfilled promise ${position + 1} in ${delay}ms`);
      } else {
        reject(new Error(`❌ Rejected promise ${position + 1} in ${delay}ms`));
      }
    }, delay);
  });
}

function createPromiseArray(amount, delay, step) {
  const promiseArray = [];

  for (let i = 0; i < amount; i++) {
    promiseArray.push(createPromise(i, delay));
    delay += step;
  }

  return promiseArray;
}

function handlePromiseArray(promiseArray) {
  promiseArray.forEach(promise => {
    promise
      .then(value => Notiflix.Notify.success(value))
      .catch(error => Notiflix.Notify.failure(error.message));
  });
}
