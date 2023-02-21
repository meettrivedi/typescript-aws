import {DynamoDB} from 'aws-sdk';
import { APIGatewayProxyEvent, APIGatewayProxyEventQueryStringParameters, APIGatewayProxyResult } from 'aws-lambda';

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;

const dynamoDbClient = new DynamoDB.DocumentClient();

async function handler(event: APIGatewayProxyEvent, context: any): Promise<APIGatewayProxyResult> {
    const result: APIGatewayProxyResult = {
        statusCode: 200,
        body: 'hello from dymamo',
    }
    

    try {
        if (event.queryStringParameters) {
            if(PRIMARY_KEY! in event.queryStringParameters){
                result.body = await queryWithPrimaryPartition(event.queryStringParameters);
            } else {
                result.body = await queryWithSecondaryPartition(event.queryStringParameters);
            }
        } else {
            result.body = await scanTable();
        }
        
    } catch (error: any) {
        console.log(error);
        result.statusCode = 500;
        result.body = error.message;
    }
  
    return  result;
}

async function scanTable() {
    const queryResponse= await dynamoDbClient.scan({
        TableName: TABLE_NAME!,
    }).promise();
    return JSON.stringify(queryResponse);
}

async function queryWithSecondaryPartition(queryParams:APIGatewayProxyEventQueryStringParameters) {
    const queryKey = Object.keys(queryParams)[0];
    const queryValue = queryParams[queryKey];

    const queryResponse= await dynamoDbClient.query({
        TableName: TABLE_NAME!,
        IndexName: queryKey!,
        KeyConditionExpression: `#secondary = :value`,
        ExpressionAttributeNames: {
            '#secondary': queryKey!,
        },
        ExpressionAttributeValues: {
            ':value': queryValue,
        }
    }).promise();
    return JSON.stringify(queryResponse.Items);
}

async function queryWithPrimaryPartition(queryParams:APIGatewayProxyEventQueryStringParameters) {
    const keyValue = queryParams[PRIMARY_KEY!];
    const queryResponse= await dynamoDbClient.query({
        TableName: TABLE_NAME!,
        KeyConditionExpression: `#primary = :value`,
        ExpressionAttributeNames: {
            '#primary': PRIMARY_KEY!,
        },
        ExpressionAttributeValues: {
            ':value': keyValue,
        }
    }).promise();
    return JSON.stringify(queryResponse);
}

export {handler};