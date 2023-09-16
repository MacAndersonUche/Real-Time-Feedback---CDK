import * as AWS from "aws-sdk";
import { genericJSON } from "../types";

AWS.config.update({ region: "eu-west-3" });
export const submit = async (
  Item: genericJSON,
  TableName: string,
  _primaryKey?: string
) => {
  const ddb = new AWS.DynamoDB.DocumentClient({
    params: { TableName },
  });

  const requestObject = {
    TableName,
    Item,
  };

  await ddb
    .put(requestObject, function (err, data) {
      if (err) console.error(err, err.stack);
    })
    .promise();
  return requestObject;
};
export const update = async (
  newStatus: string,
  TableName: string,
  _primaryKey: string
) => {
  const ddb = new AWS.DynamoDB.DocumentClient({
    params: { TableName },
  });

  const requestObject = {
    TableName,
    Key: {
      id: _primaryKey,
    },
    UpdateExpression: "set #s = :r", // Use #s as a placeholder for 'status'
    ExpressionAttributeNames: {
      "#s": "status", // Map #s to 'status' attribute
    },
    ExpressionAttributeValues: {
      ":r": newStatus,
    },
  };

  await ddb
    .update(requestObject, function (err, data) {
      if (err) console.error(err, err.stack);
    })
    .promise();
  return requestObject;
};
