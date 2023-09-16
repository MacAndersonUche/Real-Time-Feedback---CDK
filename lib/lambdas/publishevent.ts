import { APIGatewayProxyResult } from "aws-lambda";
import { pushFunction } from "../../src/publishevent";
import { shapeResponse, shapeErrorResponse } from "../../src/utils/reponse";

export const lambdaHandler = async (
  event: any
): Promise<APIGatewayProxyResult> => {
  console.log(JSON.stringify(event, null));

  const result = await pushFunction(event);
  try {
    return shapeResponse(200, { data: "Caught" });
  } catch (err) {
    console.log(err);
    return shapeErrorResponse(400, { error: err });
  }
};
