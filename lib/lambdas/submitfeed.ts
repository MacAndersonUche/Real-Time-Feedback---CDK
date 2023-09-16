import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleSubmit } from "../../src/submitfeed";
import { shapeResponse, shapeErrorResponse } from "../../src/utils/reponse";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log({ event: event.body });

  const result = await handleSubmit(JSON.parse(event.body!));
  try {
    return shapeResponse(200, { data: result });
  } catch (err) {
    console.log(err);
    return shapeErrorResponse(400, { error: err });
  }
};
