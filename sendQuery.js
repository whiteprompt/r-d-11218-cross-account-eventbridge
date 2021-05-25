const farmhash = require('farmhash');
const {buildEvent, putEvents} = require('./helpers/eventbridge');
const {get} = require('./helpers/cache');

function sleep (millis) {
  return new Promise(resolve => setTimeout(resolve, millis));
}

module.exports = {
  handler: async function(event) {
    let response = {
      ok: true
    };
    const startDate = new Date();
    const body = JSON.parse(event.body);
    let statusCode = 200;

    try {
      const {query} = body.detail;
      const queryHash = farmhash.fingerprint64(query);
      const eventOptions = body;
      let cachedQueryResult = (await get(queryHash)).Item;

      console.log(JSON.stringify({
        cachedQueryResult
      }, null, 2));

      if (cachedQueryResult === undefined) {
        eventOptions.detail.queryhash = queryHash;
        eventOptions.bus = process.env.SENDER_BUS_NAME;
        const eventBridgeEvent = buildEvent(eventOptions);

        console.log('built event', JSON.stringify(eventBridgeEvent, null, 2));

        const putEventsResult = await putEvents([eventBridgeEvent]);
        console.log('put event', JSON.stringify(putEventsResult, null, 2));

        response.event = putEventsResult;

        while (!cachedQueryResult) {
          await sleep(500);
          console.log('waiting...');
          cachedQueryResult = (await get(queryHash)).Item;
        }
        console.log('cached query result', cachedQueryResult);
      }

      const endDate = new Date();
      response.data = cachedQueryResult;
      response.ellapsedTimeInMillis = (endDate.getTime() - startDate.getTime());
    } catch (e) {
      statusCode = 500;
      response.ok = false;
      response.error = e.message;
    }

    console.log(JSON.stringify(response, null, 2));
    return {
      statusCode,
      body: JSON.stringify(response, null, 2)
    };
  }
};

