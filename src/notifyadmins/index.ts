import { Feedback } from "../types";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns";

// The AWS Region can be provided here using the `region` property. If you leave it blank
// the SDK will default to the region set in your AWS config.
export const snsClient = new SNSClient({});

export const handleSNS = async (body: any) => {
  //extract email address from object and publish to SNS with a message
  // the sns message should be a text saying they have recieved it.
  //the subscription to sns resource will be a single email address

  const dynamoDbItem = parseBody(body);

  console.log({ dynamoDbItem });

  await publishToSNS(dynamoDbItem as unknown as Feedback);

  /*

  log
  a function that takes the following 
   newItem: {
    feedbacktext: { S: 'Test1' },
    author: { S: 'OSAS' },
    id: { S: 'f53a4b29-8656-4e25-97a6-c02e8a6629f1' },
    email: { S: 'mac1@email.com' },
    status: { S: 'Submited' }
  }, and returns an object
   */
};

interface Val {
  [key: string]: string;
}
function parseBody(body: any) {
  //return array of objects
  //  const object1 = {
  //    a: "somestring",
  //    b: 42,
  //  };
  const bodyToReturn: Record<string, string> = {};
  for (const [key, value] of Object.entries(body)) {
    if (value) {
      let choiceItem = value as Val;
      bodyToReturn[key] = choiceItem["S"];
    }
  }

  return bodyToReturn;
}

async function publishToSNS(body: Feedback) {
  const TOPIC_ARN = process.env.TOPIC_ARN!;

  console.log({ TOPIC_ARN });

  // Create publish parameters
  var params = {
    Message: JSON.stringify(body) /* required */,
    TopicArn: TOPIC_ARN,
  };

  // Create promise and SNS service object
  const response = await snsClient.send(new PublishCommand(params));

  console.log({ response });
}
