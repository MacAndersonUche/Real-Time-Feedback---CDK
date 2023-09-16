import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  DynamoDBStreamEvent,
} from "aws-lambda";
import { handleSNS } from ".";
import { shapeErrorResponse, shapeResponse } from "../utils/reponse";

export const lambdaHandler = async (
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
