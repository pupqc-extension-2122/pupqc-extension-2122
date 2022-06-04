module.exports = {
  get: {
    description: 'Remove User Session',
    operationId: 'AuthLogout',
    tags: ['Authentication'],
    parameters: [],
    responses: {
      '200': {
        description: 'OK',
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