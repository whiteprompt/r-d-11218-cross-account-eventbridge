module.exports = {
  async handler (event) {
    console.log(JSON.stringify(event));

    return {
      statusCode: 200,
      body: {
        ok: true
      }
    }
  }
};
