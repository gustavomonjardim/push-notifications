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
