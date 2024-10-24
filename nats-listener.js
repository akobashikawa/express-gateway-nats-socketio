module.exports = ({ nats, io }) => {

    if (!nats) {
        throw new Error('NATS client is not available');
    }

    const sc = nats.sc;

    nats.subscribe('frontend.>', async (subject, payload) => {
        try {
            console.log(`NATS client received payload from ${subject}: ${JSON.stringify(payload)}`);
            console.log(`HANDLER of ${subject}`);
            if (io) {
                io.emit(subject, payload);
                console.log(`IO emit received nats message ${subject}: `, payload);
            }
        } catch (error) {
            console.error(`HANDLER of ${subject} error: `, error.message);
        }
    });

    console.log('NATS listeners initialized');
};