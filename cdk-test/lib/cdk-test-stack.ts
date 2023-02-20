import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import {Bucket} from 'aws-cdk-lib/aws-s3';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdkTestStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new Bucket(this, 'MyFirstBucket', {
      lifecycleRules: [{
        expiration: cdk.Duration.days(5)
      }]
    })

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkTestQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
  }
}
