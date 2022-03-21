const AWS = require("aws-sdk");
const axios = require('axios')

const dynamodb = new AWS.DynamoDB.DocumentClient();
const authenticate = require('../services/authentication')

'use strict';

module.exports.handler = async (event) => {

  try {

    const { access_token, domain } = await authenticate()
    const email = event.detail.data.user_name;
    const headers = {
        'Authorization': 'Bearer ' + access_token
    }
    const params = {
        email
    }
    const url = 'https://'+ domain +'/api/v2/users-by-email'

    const resp = await axios.get(url, { headers, params })

    if (resp.data.length > 0) {
        const valid_email = {
          TableName: process.env.DYNAMODB_TABLE,
          Key: {
            email,
          }
        }
        const items = await dynamodb.get(valid_email).promise();
        if (items.Item) {
          const update_email = {
            TableName: process.env.DYNAMODB_TABLE,
            Key: {
                email
            },
            UpdateExpression: "set attempts = attempts + :val",
            ExpressionAttributeValues: {
                ":val": 1
            },
          }
          await dynamodb.update(update_email).promise();
        } else {
          const add_email = {
            TableName: process.env.DYNAMODB_TABLE,
            Item: {
              email,
              attempts: 1
            }
          }
          await dynamodb.put(add_email).promise();
        }
        const data = {
          email
        }
        console.log(JSON.stringify(data, null, 2))
    }
  } catch (err) {
    console.log(err);
  }
}
