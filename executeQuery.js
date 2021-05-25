const {buildEvent, putEvents} = require('./helpers/eventbridge');

module.exports = {
  async handler (event) {
    try {
      console.log(JSON.stringify(event, null, 2));

      // IMPLEMENT QUERY LOGIC HERE
      const queryRequest = event.detail;
      const result = Math.floor(Math.random() * 100 + 1);
      const eventBridgeEvent = buildEvent({
        source: 'whiteprompt',
        detailType: 'query.response',
        detail: {
          ...queryRequest,
          result
        },
        bus: process.env.RECEIVER_BUS_NAME
      });

      console.log('built event', JSON.stringify(eventBridgeEvent, null, 2));

      const putEventsResult = await putEvents([eventBridgeEvent]);
      console.log('put event', JSON.stringify(putEventsResult, null, 2));
    } catch (e) {
      throw new Error('ExecuteQuery Handler error');
    }

    return {ok: true}
  }
}
