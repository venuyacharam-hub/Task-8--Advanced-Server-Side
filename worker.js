const { Worker } = require('bullmq');

console.log('Worker started');

const worker = new Worker(
    'emailQueue',

    async job => {

        console.log(`Processing email for ${job.data.email}`);

        await new Promise(resolve => setTimeout(resolve, 3000));

        console.log('Email sent successfully');

    },

    {
        connection: {
            host: '127.0.0.1',
            port: 6379
        }
    }
);