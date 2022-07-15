import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

const dynamoDbClient = new DynamoDBClient({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_DYNAMODB_ACCESSKEY as string,
        secretAccessKey: process.env.AWS_DYNAMODB_SECRETACCESSKEY as string,
    }
})

export { dynamoDbClient }


