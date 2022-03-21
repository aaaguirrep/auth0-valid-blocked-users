const AWS = require('aws-sdk')
const region = process.env.REGION
const secretId = process.env.SECRET_ID

const client = new AWS.SecretsManager({
    region: region
});

module.exports.getSecrets = async () => {
    const secrets = await client.getSecretValue({
        SecretId: secretId
    }).promise()
    return {
        domain: JSON.parse(secrets.SecretString).domain,
        client_id: JSON.parse(secrets.SecretString).client_id,
        client_secret: JSON.parse(secrets.SecretString).client_secret,
        audience: JSON.parse(secrets.SecretString).audience,
        access_token: JSON.parse(secrets.SecretString).access_token || '',
        expiration_date: JSON.parse(secrets.SecretString).expiration_date || ''
    }
}

module.exports.updateSecrets = async (access_token, expiration_date) => {
    const secrets = await client.getSecretValue({
        SecretId: secretId
    }).promise()
    const data = {
        domain: JSON.parse(secrets.SecretString).domain,
        client_id: JSON.parse(secrets.SecretString).client_id,
        client_secret: JSON.parse(secrets.SecretString).client_secret,
        audience: JSON.parse(secrets.SecretString).audience,
        access_token,
        expiration_date
    }
    const params = {
        SecretId: secretId,
        SecretString: JSON.stringify(data)
    }
    await client.updateSecret(params).promise()
}
