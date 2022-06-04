module.exports = {
  post: {
    description: 'Authenticate User',
    operationId: 'AuthLogin',
    tags: ['Authentication'],
    parameters: [],
    requestBody: {
      content: {
        'application/json': {
          schema: {
            $ref: '#/components/schemas/Login'
          }
        }
      }
    },
    responses: {
      '200': {
        description: 'Login request received.',
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ResponseBody'
            }
          }
        }
      }
    }
  }
}