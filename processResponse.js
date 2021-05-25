const {put} = require('./helpers/cache');

module.exports = {
  async handler (event) {
    try {
      console.log(JSON.stringify(event, null, 2));
      await put(event.detail);
    } catch (e) {
      console.log(e.message);
      throw new Error('process response handler failed');
    }
    return {ok: true}
  }
}
