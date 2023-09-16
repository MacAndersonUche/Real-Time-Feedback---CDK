import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as apigw from "aws-cdk-lib/aws-apigateway";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import { join } from "path";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { AttributeType, StreamViewType, Table } from "aws-cdk-lib/aws-dynamodb";
import { RemovalPolicy } from "aws-cdk-lib";
import * as sns from "aws-cdk-lib/aws-sns";
import * as ses from "aws-cdk-lib/aws-ses";
import { addCorsOptions } from "../src/utils/reponse";
import * as eventsources from "aws-cdk-lib/aws-lambda-event-sources";
import * as lambda from "@aws-cdk/aws-lambda";
export class RealTimeFeedbackCollectionCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'RealTimeFeedbackCollectionCdkQueue', {
    //   visibilityTimeout: cdk.Duration.seconds(300)
    // });
    const dynamoTable = new Table(this, "FeedbackTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      tableName: "FeedbackTable",
      stream: StreamViewType.NEW_IMAGE,

      removalPolicy: RemovalPolicy.DESTROY, // NOT recommended for production code
    });

    const topic = new sns.Topic(this, "FeedbackNotificationsTopic", {
      displayName: "FeedbackNotificationsTopic",
    });

    const identity = new ses.EmailIdentity(this, "Identity", {
      identity: ses.Identity.email("hi@macandersonuche.dev"),
    });

    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          "aws-sdk", // Use the 'aws-sdk' available in the Lambda runtime
        ],
      },
      depsLockFilePath: join(__dirname, "lambdas", "../../package-lock.json"),
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        TOPIC_ARN: topic.topicArn,
      },
      runtime: Runtime.NODEJS_16_X,
      timeout: cdk.Duration.seconds(30),
      memorySize: 128,
    };

    const submitfeedbacklambda = new NodejsFunction(
      this,
      "submitfeedbacklambda",
      {
        entry: join(__dirname, "lambdas", "submitfeed.ts"),
        ...nodeJsFunctionProps,
      }
    );
    const notifyadminslambda = new NodejsFunction(this, "notifyadminslambda", {
      entry: join(__dirname, "lambdas", "notifyadmins.ts"),
      ...nodeJsFunctionProps,
    });

    notifyadminslambda.addEventSource(
      new eventsources.DynamoEventSource(dynamoTable, {
        startingPosition: lambda.StartingPosition.LATEST,
        batchSize: 1,
        retryAttempts: 1,
      })
    );

    dynamoTable.grantStreamRead(notifyadminslambda);
    dynamoTable.grantReadWriteData(submitfeedbacklambda);

    const submitfeedbackIntegration = new LambdaIntegration(
      submitfeedbacklambda
    );
    const api = new RestApi(this, "FeedbackApi", {
      restApiName: "FeedbackApi Service",
      deployOptions: {
        stageName: "dev",
      },
    });

    topic.grantPublish(notifyadminslambda);
    const items = api.root.addResource("submit");
    items.addMethod("POST", submitfeedbackIntegration);
    addCorsOptions(items);
  }
}
