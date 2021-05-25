const AWS = require('aws-sdk');
const eventBridge = new AWS.EventBridge({
  region: process.env.REGION
});

module.exports = {
  buildEvent (opts = {}) {
    if (typeof opts !== 'object' || !opts.source || !opts.detailType || !opts.detail) {
      throw new Error('A valid event options object must be passed as parameter: {bus?, source, detailType, detail}')
    }

    const EventBusName = opts.bus || process.env.DEFAULT_EVENT_BUS_NAME || 'default';
    const Time = opts.time || new Date();
    const Detail = JSON.stringify(opts.detail);

    return {
      EventBusName,
      Source: opts.source,
      DetailType: opts.detailType,
      Detail,
      Time
    };
  },
  async putEvents (events = []) {
    if (events.length < 1) {
      throw new Error('events must be a valid array of eventbridge events');
    }

    return await eventBridge.putEvents({Entries: events}).promise();
  }
}

