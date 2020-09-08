import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as dynamodb from '@aws-cdk/aws-dynamodb';

export interface HitCounterProps {
  //the function for which we want to count url hits
  downsteam: lambda.IFunction;
}

export class HitCounter extends cdk.Construct {

  //allow acces to the counter function 
  public readonly handler: lambda.Function;

  constructor(scope: cdk.Construct, id: string, props: HitCounterProps) {
    super(scope, id);
    
    const table = new dynamodb.Table(this, 'Hits', {
      partitionKey: {name: 'path', type: dynamodb.AttributeType.STRING}
    });

    this.handler = new lambda.Function(this, 'HitsCounterHandler', {
      runtime: lambda.Runtime.NODEJS_10_X,
      handler: 'hitcounter.handler',
      code: lambda.Code.fromAsset('lambda'),
      environment: {
        DOWNSTREAM_FUNCTION_NAME: props.downsteam.functionName,
        HITS_TABLE_NAME: table.tableName
      }
    });

    //grant the lambda role read/write permissions to the table
    table.grantReadWriteData(this.handler);

    //grant the lambda role invoke permissions to the downstream function
    props.downsteam.grantInvoke(this.handler);

  }
}