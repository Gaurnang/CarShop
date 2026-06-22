import { Worker }
from "bullmq";

import connection
from "../config/redis.js";

import {
  sendEmail,
} from "../services/email.service.js";

const worker =
  new Worker(

    "email-queue",

    async (job) => {

      const {
        email,
        subject,
        html,
      } = job.data;

      await sendEmail(
        email,
        subject,
        html
      );

    },

    {
      connection,
    }
  );

worker.on(
  "completed",

  (job) => {

    console.log(
      `Job ${job.id} completed`
    );

  }
);

worker.on(
  "failed",

  (
    job,
    error
  ) => {

    console.log(
      `Job ${job.id} failed`
    );

    console.log(
      error.message
    );

  }
);