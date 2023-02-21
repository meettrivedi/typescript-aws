import { APIGatewayProxyEvent } from 'aws-lambda';
// import {handler} from '../../services/SpacesTable/Read';
// import {handler} from '../../services/SpacesTable/Create';
import {handler} from '../../services/SpacesTable/Update';

// const event = {
//     body: {
//         location: 'test location',
//     }
// }
const event: APIGatewayProxyEvent = {
    queryStringParameters: {
        SpaceId: '6d76070e-54fa-4a81-acb3-4d234e9ea913'
    },
    body: {
        location: 'new test location'
    }
} as any;
const res = handler(event as any, {} as any).then((apiRes) => {
    const items = JSON.parse(apiRes.body);
    console.log(23);
});