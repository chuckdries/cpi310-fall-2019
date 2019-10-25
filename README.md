# Chuck's CPI310 lecture Fall 2019

We're building a message board with users and authentication

## Libraries

Documentation for libraries we're using

- [express](https://expressjs.com) - web framework
- [Handlebars](https://handlebarsjs.com/) - templating system
  - [express-handlebars](https://www.npmjs.com/package/express-handlebars) - hooks up handlebars to work with express
- sqlite - two things share the same name
  - a self contained database
  - a [node package](https://www.npmjs.com/package/sqlite) for connecting to said database

## New concepts

### Promises

A [_Promise_](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises) is a way to represent data that takes time to get. Think of it as a box that may or may not have something in it right now, but we expect it to have something in it eventually. These are often used for database calls, which take time to execute.

When the metaphorical box gets a value in it, we say the promise _resolves_ to that value. We can access the value by registering a callback function with `.then`. When the promise resolves, our callback function will be called with the value it resolved to.

For example, imagine a variable called `namePromise`, which is a promise that, after 1 second, resolves to the value `"chuck"`

```javascript
namePromise.then(name => {
  console.log("Hello " + name);
});
```

When `namePromise` resolves, the function we passed into `.then` will be called with `"chuck"` passed in as the `name` argument.

### Async functions

Async functions can pause themselves and wait for promises to resolve, with the help of the `await` keyword.

```javascript
const greet = async email => {
  const name = await namePromise;
  console.log("Hello " + name);
};
```

The function above will pause itself until namePromise resolves.

> Continuing with our box metaphor, There is no way to simply "peek inside" the box. To access its contents, you must `await` the promise or use `.then` and a callback. You can safely do either even after a promise has already resolved, it will work just fine.

### Middleware

Middleware is an express-specific concept that lets us intercept and work with requests. We'll go over this on Tuesday

### ESModules
