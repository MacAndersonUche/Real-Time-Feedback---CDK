import { APIGatewayProxyResult, SQSEvent } from "aws-lambda";
import { handleSQS } from ".";
import { shapeErrorResponse, shapeResponse } from "../utils/reponse";

export const lambdaHandler = async (
  event: SQSEvent
): Promise<APIGatewayProxyResult> => {
  const body = JSON.parse(event.Records[0].body);
  const result = await handleSQS(body);

  try {
    return shapeResponse(200, { data: result });
  } catch (err) {
    console.log(err);
    return shapeErrorResponse(400, { error: err });
  }
};
