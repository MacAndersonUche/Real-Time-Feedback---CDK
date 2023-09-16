import ajv, { ErrorObject } from "ajv";

interface genericJSON {
  [key: string]: any;
}

const Ajv = new ajv();

const mapErrors = (errors: ErrorObject[]) => {
  return errors.map((error) => {
    switch (error.keyword) {
      case "required":
        return `Missing parameter: ${error.params}`;
      case "additionalProperties":
        return `Invalid parameter found.`;
      default:
        return "Unknown error.";
    }
  });
};

export const validateJson = (schema: genericJSON, body: genericJSON) => {
  const validateSchema = Ajv.compile(schema);
  if (validateSchema(body)) {
    return null;
  } else {
    return mapErrors(validateSchema.errors as ErrorObject[]);
  }
};
