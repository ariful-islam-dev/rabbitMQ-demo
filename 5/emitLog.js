const amqp = require('amqplib');

const emitLog = async()=>{
    const connection = await amqp.connect('amqp://localhost');
    const channel = await connection.createChannel();

    const exchange = 'direct_logs';
    const args = process.argv.slice(2);
    console.log("Args: ", args);



    const msg = args.slice(1).join(" ") || 'Hello World!';
     await channel.assertExchange(exchange, 'direct', {
        durable: false
    });
    const severity = args.length > 0 ? args[0] : 'info';

    await channel.checkExchange(exchange, 'direct', {durable: false});
    channel.publish(exchange, severity, Buffer.from(msg));
    console.log(' [x] Sent %s: %s', severity, msg);


    setTimeout(()=>{
        connection.close();
        process.exit(0);
    }, 500)
}

emitLog();