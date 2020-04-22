const pushButton = document.querySelector('.push-button');

let isSubscribed = false;

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

initializeUI();
