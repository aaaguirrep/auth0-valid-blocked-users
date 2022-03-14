const axios = require('axios')

'use strict';

module.exports.handler = async (event) => {


  try {

    const email = event.detail.data.user_name;
    const headers = {
        'Authorization': 'Bearer ' + process.env.TOKEN
    }
    const params = {
        email
    }
    const url = 'https://'+ process.env.AUTH0_NX_DOMAIN +'/api/v2/users-by-email'

    const resp = await axios.get(url, { headers, params })

    if (resp.data.length > 0) {
        const data = {
            email
        }
        console.log(JSON.stringify(data, null, 2))
    }

  } catch (err) {
    console.log(err);
  }

}