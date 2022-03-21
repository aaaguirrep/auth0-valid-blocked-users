const axios = require("axios");

const secrets = require('./secrets')

const date = new Date()

async function get_token(getSecrets) {
    const body = {
        grant_type: 'client_credentials',
        client_id: getSecrets.client_id,
        client_secret: getSecrets.client_secret,
        audience: getSecrets.audience,
    }
    const url = `https://${getSecrets.domain}/oauth/token`
    const response = await axios.post(url, body)
    const access_token = await response.data.access_token
    await secrets.updateSecrets(access_token, date.setTime(date.getTime() + (23.9 * 60 * 60 * 1000)))
    return { access_token, domain: getSecrets.domain }
}

module.exports = async () => {
    try {
        const getSecrets = await secrets.getSecrets()
        if (!getSecrets.access_token) {
            return await get_token(getSecrets)
        } else if (getSecrets.expiration_date < date.getTime()) {
            return await get_token(getSecrets)
        } else {
            return await getSecrets.access_token
        }
    } catch (err) {
        console.error(err.message)
    }
}
