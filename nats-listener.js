module.exports = ({ nats, io }) => {

    if (!nats) {
        throw new Error('NATS client is not available');
    }

    const sc = nats.sc;

    nats.subscribe('frontend.>', async (subject, payload) => {
        const message = payload.message;
        console.log(`NATS client received message from frontend.test: ${message}`);
        try {
            console.log(`HANDLER of frontend.test`);
            if (io) {
                io.emit(subject, payload);
                console.log(`IO emit nats-message ${subject}: `, payload);
            }
        } catch (error) {
            console.error(`HANDLER of frontend.test error: `, error.message);
        }
    });

    console.log('NATS listeners initialized');
};