import { urlB64ToUint8Array } from './utils.js';

const mainSection = document.querySelector('.main-section');
const pushCheckbox = document.querySelector('.enable-push');
const fallback = document.querySelector('.fallback');
const denied = document.querySelector('.denied');

const sendButton = document.querySelector('.send-button');
const notificationContent = document.querySelector('.notification-content');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');

const VAPID_PUBLIC_KEY =
  'BBbjYjIayKHSY4WQpQApYNLzuM4CtobiT-rYFPcRHqglL91yAq2PgaODn5MbtE0dCmGD7zQRfoaB4J6y0LytA9s';

let isSubscribed = false;
let swRegistration = null;
let subscription = null;

function askPermission() {
  return new Promise(function (resolve, reject) {
    const permissionResult = Notification.requestPermission(function (result) {
      resolve(result);
    });

    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(function (permissionResult) {
    if (permissionResult !== 'granted') {
      mainSection.style.display = 'none';
      denied.style.display = 'block';
    } else {
      mainSection.style.display = 'block';
      denied.style.display = 'none';
      subscribeUser();
    }
  });
}

function toggleCheckbox() {
  if (isSubscribed) {
    unsubscribeUser();
  } else {
    askPermission();
  }
}

async function initializeUI() {
  pushCheckbox.addEventListener('click', toggleCheckbox);

  subscription = await swRegistration.pushManager.getSubscription();
  isSubscribed = !(subscription === null);
  updateUI();
}

function updateUI() {
  if (isSubscribed) {
    pushCheckbox.checked = true;
    fallback.style.display = 'none';
    notificationContent.style.display = 'block';
    sendButton.addEventListener('click', () => {
      sendPushNotification();
    });
  } else {
    pushCheckbox.checked = false;
    fallback.style.display = 'block';
    notificationContent.style.display = 'none';
  }
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
    isSubscribed = false;

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

    if (Notification.permission === 'denied') {
      mainSection.style.display = 'none';
      denied.style.display = 'block';
    }

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
  const title = titleInput.value;
  const content = contentInput.value;

  if (!title || !content) {
    return;
  }

  const body = {
    config: { title, content },
    subscription: subscription,
  };

  const config = {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  };

  try {
    const response = await fetch('/.netlify/functions/push-service', config);
    const data = await response.json();

    console.log(data);
  } catch (err) {
    console.log(err);
  }
}
