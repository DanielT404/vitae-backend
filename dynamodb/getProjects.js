import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb"
import { dynamoDbClient } from './client.js'

const getProjects = async () => {
    const document = DynamoDBDocumentClient.from(dynamoDbClient);
    const instructions = {
        TableName: "vitae_projects"
    }
    try {
        const command = new ScanCommand(instructions);
        const response = await document.send(command);
        response.Items = response.Items.sort((prev, curr) => prev.in_view_order - curr.in_view_order);
        return response.Items;
    } catch (err) {
        throw new Error(err);
    }
}

export { getProjects }