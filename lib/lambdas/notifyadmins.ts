import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  DynamoDBStreamEvent,
} from "aws-lambda";
import { handleSNS } from "../../src/notifyadmins";
import { shapeResponse, shapeErrorResponse } from "../../src/utils/reponse";

export const handler = async (
  event: DynamoDBStreamEvent
): Promise<APIGatewayProxyResult> => {
  const result = await handleSNS(event.Records[0].dynamodb?.NewImage);

  try {
    return shapeResponse(200, { data: result });
  } catch (err) {
    console.log(err);
    return shapeErrorResponse(400, { error: err });
  }
};
