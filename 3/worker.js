const amqp = require('amqplib');

async function worker(){
    try {
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();
        const queue = 'task_queue';
        await channel.assertQueue(queue, {
            durable: false
        });
        channel.prefetch(1);
        

        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue);

        channel.consume(queue, msg => {

            // if exit argument found exit the process
            const exit = process.argv.slice(2).join(' ');
            console.log('exit', exit);

            if(exit){
                console.log('exiting....')
                process.exit(0)
            }
            const secs = msg.content.toString().split('.').length -1;
            console.log(" [x] Received %s", msg.content.toString());


            setTimeout(()=>{
                console.log(`[x] Done`);
                channel.ack(msg)
            }, secs * 10)
        }, {
            noAck: false
        });

    } catch (error) {
        console.log(error);
    }
}

worker();