const trait = {
  success: data => ({
    status: true,
    statusCode: 200,
    data,
    message: '200 OK!',
  }),

  error: (message, statusCode) => ({
    status: false,
    statusCode: statusCode || 500,
    data: {},
    message,
  }),

  notFound(message = 'RESOURCE_NOT_FOUND') { return this.error(message, 404); },

  notAuthorized(message = 'NOT_AUTHORIZED_FOR_THIS_URI') { return this.error(message, 403); },

  notAuthenticated(message = 'NOT_AUTHENTICATED') { return this.error(message, 401); },

  badRequest(message = 'BAD_REQUEST') { return this.error(message, 400); },

  findByCode(code) {
    switch (code) {
      case 404:
        return this.notFound();
      case 403:
        return this.notAuthorized();
      case 401:
        return this.notAuthenticated();
      case 400:
        return this.badRequest();
      default:
        return this.error('INTERNAL_ERROR_SERVER');
    }
  },
};

export default trait;
