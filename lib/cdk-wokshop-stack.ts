import * as cdk from '@aws-cdk/core';
import * as lambda from '@aws-cdk/aws-lambda';
import * as apigw from '@aws-cdk/aws-apigateway';
import { HitCounter } from './hitcounter';

export class CdkWokshopStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //define the AWS lambda resource
    const hello = new lambda.Function(this, 'HelloHandler',{
      runtime: lambda.Runtime.NODEJS_10_X,   //execution environment
      code: lambda.Code.fromAsset('lambda'),
      handler: 'hello.handler'
    });

    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downsteam: hello
    });

    //define the API gateway REST API resource backed by our "hello" function
    new apigw.LambdaRestApi(this, 'Endpoint', {
      handler: helloWithCounter.handler
    });
    
  }
}
