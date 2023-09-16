import { readFileSync } from "fs";
import { submit, update } from "../utils/dynamodb";
import { Status } from "../types";
const AWS = require("aws-sdk");
export const handleSQS = async (body: any) => {
  const tableName = process.env.TABLE_NAME || "submit-feedback";
  const eventTableName =
    process.env.EVENTS_TABLE_NAME || "submit-feedback-events";

  const details = extractEmailAndName(JSON.parse(body.Message));
  const html = getTemplate();

  await sendEmail(
    details.email,
    "macandy99@gmail.com",
    "THANKS FOR SIGNING UP",
    html
  );

  await update(Status.Actioned, tableName, details.id);

  await submit(JSON.parse(body.Message), eventTableName, "id");

  return "Updated, Email sent successfully";
};

interface Extracted {
  id: string;
  email: string;
  name: string;
}
function extractEmailAndName({ id, email, name }: Extracted) {
  return {
    id,
    email,
    name,
  };
}

function getTemplate(): string {
  return readFileSync("src/processfeed/welcome.html", "utf-8");
}

async function sendEmail(
  toAddress: string,
  fromAddress: string,
  subject: string,
  body: string
) {
  const ses = new AWS.SES({ region: "eu-west-3" });

  const params = {
    Destination: {
      ToAddresses: [toAddress],
    },
    Message: {
      Body: {
        Html: { Data: body },
      },
      Subject: { Data: subject },
    },
    Source: fromAddress,
  };

  return ses.sendEmail(params).promise();
}
