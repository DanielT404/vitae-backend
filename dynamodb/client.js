import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

const dynamoDbClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_DYNAMODB_ACCESSKEY,
        secretAccessKey: process.env.AWS_DYNAMODB_SECRETACCESSKEY,
    }
})

export { dynamoDbClient }


