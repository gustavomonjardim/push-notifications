import { urlB64ToUint8Array } from './utils.js';

const pushButton = document.querySelector('.push-button');
const sendButton = document.querySelector('.send-button');
const notificationContent = document.querySelector('.notification-content');

const VAPID_PUBLIC_KEY =
  'BBbjYjIayKHSY4WQpQApYNLzuM4CtobiT-rYFPcRHqglL91yAq2PgaODn5MbtE0dCmGD7zQRfoaB4J6y0LytA9s';

let isSubscribed = false;
let swRegistration = null;
let subscription = null;

function handlePushButtonClick() {
  pushButton.disabled = true;
  if (isSubscribed) {
    unsubscribeUser();
  } else {
    subscribeUser();
  }
}

async function initializeUI() {
  pushButton.addEventListener('click', handlePushButtonClick);

  subscription = await swRegistration.pushManager.getSubscription();
  isSubscribed = !(subscription === null);
  updateUI();
}

function updateUI() {
  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Notifications';
    pushButton.classList.remove('positive');
    pushButton.classList.add('negative');

    notificationContent.style.display = 'block';
    sendButton.addEventListener('click', () => {
      sendPushNotification();
    });
  } else {
    pushButton.textContent = 'Enable Push Notifications';
    pushButton.classList.remove('negative');
    pushButton.classList.add('positive');
  }

  pushButton.disabled = false;
}

async function subscribeUser() {
  try {
    subscription = await swRegistration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    console.log('User is subscribed: ', JSON.stringify(subscription));
    isSubscribed = true;
    updateUI();
  } catch (err) {
    console.log('Failed to subscribe the user: ', err);
  }
}

async function unsubscribeUser() {
  try {
    await subscription.unsubscribe();

    console.log('User is unsubscribed.');
    isSubscribed = false;
    subscription = null;
    updateUI();
  } catch (err) {
    console.log('Error unsubscribing', err);
  }
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

async function sendPushNotification() {
  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(subscription),
  };

  try {
    const response = await fetch('/.netlify/functions/push-service', config);
    const data = await response.json();

    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
