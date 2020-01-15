const cookie = require("cookie");

module.exports = {
  requestDidStart() {
    return {
      willSendResponse(requestContext) {
        if (!Array.isArray(requestContext.context.setHeaders)) {
          console.warn("setHeaders is not in context or is not an array");
        }
        if (!Array.isArray(requestContext.context.setCookies)) {
          console.warn("setCookies is not in context or is not an array");
        }

        const { setHeaders = [], setCookies = [] } = requestContext.context;

        setHeaders.forEach(({ key, value }) => {
          requestContext.response.http.headers.append(key, value);
          console.debug("set header " + key + ": " + value);
        });

        setCookies.forEach(({ name, value, options }) => {
          var cookieString = cookie.serialize(name, value, options);
          requestContext.response.http.headers.append("Set-Cookie", cookieString);
          console.debug("set header Set-Cookie: " + cookieString);
        });

        return requestContext;
      }
    };
  }
};
