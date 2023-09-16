import { APIGatewayProxyResult } from "aws-lambda";

import { shapeErrorResponse, shapeResponse } from "../utils/reponse";

export const lambdaHandler = async (
  event: any
): Promise<APIGatewayProxyResult> => {
  console.log(JSON.stringify(event, null, 2));
  try {
    return shapeResponse(200, { data: "Caught" });
  } catch (err) {
    console.log(err);
    return shapeErrorResponse(400, { error: err });
  }
};
