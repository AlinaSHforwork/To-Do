// notification-worker.js
const amqp = require('amqplib');

async function startWorker() {
    try {
        const connection = await amqp.connect('amqp://localhost'); // Localhost because we run this script outside Docker for testing
        const channel = await connection.createChannel();
        await channel.assertQueue('notifications');

        console.log("Waiting for messages...");

        channel.consume('notifications', (msg) => {
            const data = JSON.parse(msg.content.toString());
            console.log(`[EMAIL SERVICE] Sending email to ${data.email}: "New Task Created: ${data.taskContent}"`);
            channel.ack(msg);
        });
    } catch (error) {
        console.error(error);
    }
}
startWorker();