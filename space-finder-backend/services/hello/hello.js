




exports.main = async (event, context) => {
  console.log('event : ', event)
  return {
    statusCode: 200,
    body: "hello world",
  }
}