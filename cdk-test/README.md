# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

To start a default cdk project, run the following commands:
# useful commands
```$ npm install -g aws-cdk``` - install cdk globally
```$ cdk init app --language typescript ``` - initialize cdk with typescript
``` cdk bootstrap --profile prod ``` - bootstrap the project to aws account
``` cdk synth ``` - synthesize the cloudformation template
``` cdk deploy ``` - deploy the stack to aws account
``` cdk diff ``` - compare the deployed stack with current state
``` cdk destroy ``` - destroy the stack (optional with stack name or --all)
``` cdk deploy SecondStack ```
``` cdk list ``` - list all the cdk stacks
``` cdk destroy SecondStack ``` - destroy the stack with stack name
``` cdk destroy --all ``` - destroy all the stacks

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template
