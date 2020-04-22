import { urlB64ToUint8Array } from './utils.js';

const pushButton = document.querySelector('.push-button');

const PUBLIC_KEY =
  'BDw0pzvsRvUjhaCCxVJaIUlTfkZLBjeKAzMnz1m1It6gVoYhfMeQXggIM6pHqredieWHAh8mgenmVY-uM6O92GQ';

let isSubscribed = false;
let swRegistration = null;

async function initializeUI() {
  pushButton.addEventListener('click', () => {
    pushButton.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  });

  const subscription = await swRegistration.pushManager.getSubscription();

  isSubscribed = !(subscription === null);

  if (isSubscribed) {
    console.log('User IS subscribed.');
  } else {
    console.log('User is NOT subscribed.');
  }

  updateBtn();
}

function updateBtn() {
  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Notifications';
    pushButton.classList.remove('positive');
    pushButton.classList.add('negative');
  } else {
    pushButton.textContent = 'Enable Push Notifications';
    pushButton.classList.remove('negative');
    pushButton.classList.add('positive');
  }

  pushButton.disabled = false;
}

async function subscribeUser() {
  const SERVER_KEY = urlB64ToUint8Array(PUBLIC_KEY);

  try {
    const subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: SERVER_KEY,
    });

    console.log('User is subscribed: ', JSON.stringify(subscription));
    isSubscribed = true;
  } catch (err) {
    console.log('Failed to subscribe the user: ', err);
  } finally {
    updateBtn();
  }
}

function unsubscribeUser() {
  isSubscribed = false;
  updateBtn();
}

async function registerServiceWorker() {
  try {
    const swReg = await navigator.serviceWorker.register('serviceWorker.js');

    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
    initializeUI();
  } catch (err) {
    console.error('Service Worker Error', err);
  }
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');
  registerServiceWorker();
}
