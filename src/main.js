const pushButton = document.querySelector('.push-button');

let isSubscribed = false;
let swRegistration = null;

function initializeUI() {
  pushButton.addEventListener('click', () => {
    pushButton.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  });
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

function subscribeUser() {
  isSubscribed = true;
  updateBtn();
}

function unsubscribeUser() {
  isSubscribed = false;
  updateBtn();
}

async function registerServiceWorker() {
  try {
    const swReg = await navigator.serviceWorker.register('sw.js');

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
