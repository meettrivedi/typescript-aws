import {DynamoDB} from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 } from 'uuid';

const TABLE_NAME = process.env.TABLE_NAME as string;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;

const dynamoDbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: any): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'hello from dymamo',
    }
    
    const requestBody = typeof event.body === 'object' ? event.body : JSON.parse(event.body);
    const spaceId = event.queryStringParameters?.[PRIMARY_KEY];

    if (!spaceId) {
        result.statusCode = 400;
        result.body = 'SpaceId is required';
        return result;
    }
// only handles first key in request body
    if(requestBody && spaceId){
        const requestBodyKey = Object.keys(requestBody)[0];
        const requestBodyValue = requestBody[requestBodyKey];
        const updateResult = await dynamoDbClient.update({
            TableName: TABLE_NAME,
            Key: {
                [PRIMARY_KEY]: spaceId,
            },
            UpdateExpression: `set #key = :value`,
            ExpressionAttributeNames: {
                '#key': requestBodyKey,
            },
            ExpressionAttributeValues: {
                ':value': requestBodyValue,
            },
            ReturnValues: 'UPDATED_NEW',
        }).promise();
        result.body = JSON.stringify(updateResult);
    }
    return  result;
}

export {handler};