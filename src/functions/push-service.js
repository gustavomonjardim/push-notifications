const webPush = require('web-push');

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

webPush.setVapidDetails(
  'https://serviceworke.rs/',
  process.env.PUBLIC_KEY,
  process.env.PRIVATE_KEY
);

export async function handler(event) {
  if (!process.env.PUBLIC_KEY || !process.env.PRIVATE_KEY) {
    console.log(
      'You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables. You can use the following ones:',
      webPush.generateVAPIDKeys()
    );
    return {
      statusCode: 500,
      body: 'You must set the VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables',
    };
  }

  try {
    const subscription = JSON.parse(event.body);

    await webPush.sendNotification(subscription);
    return {
      statusCode: 200,
      body: JSON.stringify(subscription),
    };
  } catch (err) {
    console.log(err);
    return { statusCode: 500, body: err.toString() };
  }
}
