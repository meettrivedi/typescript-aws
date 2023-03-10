import {Stack, StackProps} from 'aws-cdk-lib';
import {Construct} from 'constructs';
import {Code, Function as LambdaFunction, Runtime} from 'aws-cdk-lib/aws-lambda';
import {join} from 'path';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { GenericTable } from './GenericTable';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';

export class SpaceStack extends Stack {

    private api = new RestApi(this, 'SpaceApi');    
    private spacesTable = new GenericTable(this, {
        tableName: 'SpacesTable',
        primaryKey: 'SpaceId',
        createLambdaPath: 'Create',
        readLambdaPath: 'Read',
        updateLambdaPath: 'Update',
        secondaryIndexes: ['location'],
    })
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const helloLambdaNodeJs = new NodejsFunction(this, 'HelloLambdaNodeJs', {
            entry: join(__dirname,'..', 'services', 'node-lambda', 'hello.ts'),
            handler: 'handler',
            
        });

        const s3ListBucketsPolicy = new PolicyStatement();
        s3ListBucketsPolicy.addActions('s3:ListAllMyBuckets');
        s3ListBucketsPolicy.addResources('*');

        helloLambdaNodeJs.addToRolePolicy(s3ListBucketsPolicy);

        // hello api lambda integration:
        const helloLambdaIntegration = new LambdaIntegration(helloLambdaNodeJs);
        const helloLambdaResource = this.api.root.addResource('hello')
        helloLambdaResource.addMethod('GET', helloLambdaIntegration);


        //Spaces API Integration:
        const spaceResource = this.api.root.addResource('spaces');
        spaceResource.addMethod('POST', this.spacesTable.createLambdaIntegration);
        spaceResource.addMethod('GET', this.spacesTable.readLambdaIntegration);
        spaceResource.addMethod('PUT', this.spacesTable.updateLambdaIntegration);

    }
}