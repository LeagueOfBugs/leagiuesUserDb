const { DynamoDBClient, ScanCommand } = require("@aws-sdk/client-dynamodb");
const { unmarshall } = require("@aws-sdk/util-dynamodb");

const client = new DynamoDBClient({});

exports.handler = async (event, context) => {
  const { email } = event;
  const tableName = "users";
  const params = {
    TableName: tableName,
  };

  const command = new ScanCommand(params);

  try {
    const response = await client.send(command);
    const convertedData = response.Items.map((item) => unmarshall(item));
    const user = convertedData.find((use) => use.email === email);

    return {
      statusCode: 200,
      body: JSON.stringify(user),
    };
  } catch (error) {
    console.log(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
