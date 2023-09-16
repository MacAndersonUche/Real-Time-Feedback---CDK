import * as AWS from "aws-sdk";

AWS.config.region = process.env.AWS_REGION || "us-east-1";
const eventbridge = new AWS.EventBridge();

export const pushFunction = async (event: any) => {
  console.log(JSON.stringify(event, null, 2));
  const myEventBusName = process.env.EVENT_BUS_NAME;
  let payload: AWS.EventBridge.PutEventsRequest = { Entries: [] };
  event.Records.forEach((item: any) => {
    payload.Entries.push({
      // Event envelope fields
      Source: "FeedbackEventsTable",
      EventBusName: myEventBusName,
      DetailType: "transaction",
      Time: new Date(),

      // Main event body
      Detail: JSON.stringify(item),
    });
  });
  console.log("Payload to Event Bridge");
  console.log(payload);
  const result = await eventbridge.putEvents(payload).promise();
  console.log("EventBridge result");
  console.log(result);

  return result;
};
