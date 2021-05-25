const AWS = require('aws-sdk');
const dbClient = new AWS.DynamoDB.DocumentClient({
  region: process.env.REGION
});

module.exports = {
  get (queryhash) {
    return dbClient.get({
        TableName: process.env.QUERY_CACHE_TABLE_NAME,
        Key: {
          queryhash
        }
      }
    ).promise();
  },
  put (data) {
    return dbClient.put({
      Item: data,
      TableName: process.env.QUERY_CACHE_TABLE_NAME
    }).promise();
  }
}
