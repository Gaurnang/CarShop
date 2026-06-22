import emailQueue
from "../queues/email.queue.js";

const queueEmail =
  async (
    email,
    subject,
    html
  ) => {

    await emailQueue.add(

      "send-email",

      {
        email,
        subject,
        html,
      },

      {
        attempts: 3,

        backoff: {
          type: "exponential",
          delay: 5000,
        },

        removeOnComplete: true,

        removeOnFail: 100,
      }
    );

  };

export {
  queueEmail,
};