import {DynamoDB} from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 } from 'uuid';

const TABLE_NAME = process.env.TABLE_NAME;

const dynamoDbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: any): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'hello from dymamo',
    }
    
    
    const item = typeof event.body === 'object' ? event.body : JSON.parse(event.body);
    item.SpaceId = v4();

    try {
        await dynamoDbClient.put({
            TableName: TABLE_NAME!,
            Item: item,
        }).promise();
    } catch (error: any) {
        console.log(error);
        result.statusCode = 500;
        result.body = error.message;
    }
    result.body = JSON.stringify(`item created: ${item.SpaceId}`);
    return  result;
}

export {handler};