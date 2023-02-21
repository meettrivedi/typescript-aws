import { Stack } from 'aws-cdk-lib';
import {AttributeType, Table} from 'aws-cdk-lib/aws-dynamodb';
import {NodejsFunction} from 'aws-cdk-lib/aws-lambda-nodejs';
import {LambdaIntegration} from 'aws-cdk-lib/aws-apigateway';
import {join} from 'path';


export interface TableProps {
    createLambdaPath?: string;
    readLambdaPath?: string;
    updateLambdaPath?: string;
    deleteLambdaPath?: string;
    tableName: string;
    primaryKey: string;
    secondaryIndexes?: string[];
}



export class GenericTable {
    private stack: Stack;
    private table: Table;
    private props: TableProps;

    private createLambdaPath: NodejsFunction | undefined;
    private readLambdaPath: NodejsFunction | undefined;
    private updateLambdaPath: NodejsFunction | undefined;
    private deleteLambdaPath: NodejsFunction | undefined;

    public createLambdaIntegration: LambdaIntegration;
    public readLambdaIntegration: LambdaIntegration;
    public updateLambdaIntegration: LambdaIntegration;
    public deleteLambdaIntegration: LambdaIntegration;

    public constructor(stack: Stack, props: TableProps) {
        this.stack = stack;
        this.props = props;
        this.initialize();
    }
    private initialize(){
        this.createTable();
        this.addSecondaryIndexes();
        this.createLambdas();
        this.grantTableRights();
    }
    private addSecondaryIndexes() {
        if(this.props.secondaryIndexes){
            this.props.secondaryIndexes.forEach(index => {
                this.table.addGlobalSecondaryIndex({
                    indexName: index,
                    partitionKey: {
                        name: index,
                        type: AttributeType.STRING,
                    },
                });
            });
        }
    }
    private createLambdas(){
        if(this.props.createLambdaPath){
            this.createLambdaPath = this.createSingleLambda(this.props.createLambdaPath);
            this.createLambdaIntegration = new LambdaIntegration(this.createLambdaPath);
        }
        if(this.props.readLambdaPath){
            this.readLambdaPath = this.createSingleLambda(this.props.readLambdaPath);
            this.readLambdaIntegration = new LambdaIntegration(this.readLambdaPath);
        }
        if(this.props.updateLambdaPath){
            this.updateLambdaPath = this.createSingleLambda(this.props.updateLambdaPath);
            this.updateLambdaIntegration = new LambdaIntegration(this.updateLambdaPath);
        }
        if(this.props.deleteLambdaPath){
            this.deleteLambdaPath = this.createSingleLambda(this.props.deleteLambdaPath);
            this.deleteLambdaIntegration = new LambdaIntegration(this.deleteLambdaPath);
        }
    }

    private grantTableRights(){
        if(this.createLambdaPath){
            this.table.grantWriteData(this.createLambdaPath);
        }
        if(this.readLambdaPath){
            this.table.grantReadData(this.readLambdaPath);
        }
        if(this.updateLambdaPath){
            this.table.grantWriteData(this.updateLambdaPath);
        }
        if(this.deleteLambdaPath){
            this.table.grantWriteData(this.deleteLambdaPath);
        }
    }

    private createTable(){
        this.table = new Table(this.stack, this.props.tableName, {
            partitionKey: {
                name: this.props.primaryKey, 
                type: AttributeType.STRING
            },
            tableName: this.props.tableName,
        });
    }
    private createSingleLambda(lambdaName: string): NodejsFunction {
        const lambdaId = `${this.props.tableName}-${lambdaName}`;
        return new NodejsFunction(this.stack, lambdaName, {
            entry: join(__dirname, '..', 'services', this.props.tableName, `${lambdaName}.ts`),
            handler: 'handler',
            functionName: lambdaId,
            environment: {
                TABLE_NAME: this.props.tableName,
                PRIMARY_KEY: this.props.primaryKey,
            },
        });

    }

}