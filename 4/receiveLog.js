const amqp = require('amqplib');

const receiveLog = async()=>{
    try{
        const connection = await amqp.connect('amqp://localhost');
        const channel = await connection.createChannel();

        const exchange = 'logs';
        await channel.assertExchange(exchange, 'fanout', {
            durable: false
        });

        const q = await channel.assertQueue('', {
            exclusive: true
        })
        console.log(' [*] Waiting for logs. To exit press CTRL+C', q.queue);
        channel.bindQueue(q.queue, exchange, "");

        channel.consume(q.queue, msg => {
            console.log(' [x] Received %s', msg.content.toString());
        }, {
            noAck: true
        });
    }catch(error){
        console.log(error);
    }
}

receiveLog()