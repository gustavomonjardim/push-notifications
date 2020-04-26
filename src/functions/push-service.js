const webPush = require('web-push');

require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

webPush.setVapidDetails(
  'https://serviceworke.rs/',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function handler(event) {
  if (!process.env.VAPID_PUBLIC_KEY || !process.env.VAPID_PRIVATE_KEY) {
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
    const { subscription, config } = JSON.parse(event.body);

    const res = await webPush.sendNotification(subscription, JSON.stringify(config));
    console.log(res);

    return {
      statusCode: 200,
      body: JSON.stringify({ data: { success: true } }),
    };
  } catch (err) {
    console.log(err);
    return { statusCode: 500, body: err.toString() };
  }
}
