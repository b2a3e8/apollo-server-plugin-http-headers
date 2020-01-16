# apollo-server-plugin-http-headers

Allows you to set HTTP Headers and Cookies easily in your resolvers. This is especially useful in apollo-server-lambda, because you don't have any other options there to set headers or cookies.

The way it works is simple: you put an array for cookies and an array for headers in your context; you can then access them in your resolvers (and therefore add, alter or delete headers and cookies). Before your request is sent to the client this plugin loops through the arrays and adds every item to the HTTP response. The logic is very easy, actually the documentation is way longer than the source code.

## Installation

### Install the package

`npm install apollo-server-plugin-http-headers`

### Register plugin

Import and register the plugin, then add `setHeaders` and `setCookies` to context:

```javascript
const httpHeadersPlugin = require("apollo-server-plugin-http-headers");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [httpHeadersPlugin],
    context: {
        setCookies: new Array(),
        setHeaders: new Array()
    }
});
```

Please note: The context argument varies depending on the specific integration (e.g. Express, Koa,  Lambda, etc.) being used. See the [official apollo-server documentation](https://www.apollographql.com/docs/apollo-server/api/apollo-server/) for more details.
Example for the Lambda integration (apollo-server-lambda):

```javascript
const httpHeadersPlugin = require("apollo-server-plugin-http-headers");

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [httpHeadersPlugin],
    context: ({ event, context }) => {
        return {
            event,
            context,
            setCookies: new Array(),
            setHeaders: new Array()
        };
    }
});
```

## Usage

### Headers

Set a header in a resolver:

```javascript
context.setHeaders.push({ key: "headername", value: "headercontent" });
```

Complete example:

```javascript
const resolvers = {
    Query: {
        hello: async (parent, args, context, info) => {
            context.setHeaders.push({ key: "X-TEST-ONE", value: "abc" });
            context.setHeaders.push({ key: "X-TEST-TWO", value: "def" });
            return "Hello world!";
        }
    }
};
```

### Cookies

Set a cookie in a resolver:

```javascript
context.setCookies.push({
    name: "cookieName",
    value: "cookieContent",
    options: {
        domain: "example.com",
        expires: new Date("2021-01-01T00:00:00"),
        httpOnly: true,
        maxAge: 3600,
        path: "/",
        sameSite: true,
        secure: true
    }
});
```

Complete example:

```javascript
const resolvers = {
    Query: {
        hello: async (parent, args, context, info) => {

            context.setCookies.push({
                name: "cookieName",
                value: "cookieContent",
                options: {
                    domain: "example.com",
                    expires: new Date("2021-01-01T00:00:00"),
                    httpOnly: true,
                    maxAge: 3600,
                    path: "/",
                    sameSite: true,
                    secure: true
                }
            });

            return "Hello world!";
        }
    }
};
```

#### Cookie Options

This package uses [jshttp/cookie](https://github.com/jshttp/cookie) for serializing cookies and you can use all the options they provide. Find an overview below or the complete documentation [here](https://github.com/jshttp/cookie#cookieserializename-value-options).

option | description
--- | ---
domain | Specifies the value for the [`Domain` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.3). By default, no domain is set.
encode | Specifies a function that will be used to encode a cookie's value. Default: `encodeURIComponent`
expires | Specifies the `Date` object to be the value for the [`Expires` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.1). If expires and maxAge are set, maxAge mostly wins on the client side. By default, no expiration is set.
httpOnly | Specifies the boolean value for the [`HttpOnly` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.6). Defaults to `false`.
maxAge | Specifies the number (in seconds) to be the value for the [`Max-Age` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.2). By default, no maximum age is set.
path | Specifies the value for the [`Path` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.4). By default, no path is set and the user agent computes a path according to [these algorithms](https://tools.ietf.org/html/rfc6265#section-5.1.4).
sameSite | Specifies the boolean or string to be the value for the [`SameSite` `Set-Cookie` attribute](https://tools.ietf.org/html/draft-ietf-httpbis-rfc6265bis-03#section-4.1.2.7). Valid values: `true`, `false`, `'lax'`, `'none'` and `'strict'`.
secure | Specifies the boolean value for the [`Secure` `Set-Cookie` attribute](https://tools.ietf.org/html/rfc6265#section-5.2.5).By default, the `Secure` attribute is not set.

## Limitations

### Only one cookie can be set per request

There is at the moment no possility to set multiple cookies because apollo server does not support that. Find details and workaround inspiration [here](https://github.com/apollographql/apollo-server/issues/3040).
If you add multiple items to setCookie I'll throw an exception at your face (-;
