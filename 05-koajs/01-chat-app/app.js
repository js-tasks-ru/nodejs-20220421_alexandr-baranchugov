const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

let requestResolve;
let requestPromise;

const Router = require('koa-router');
const router = new Router();

newRequestPromise();

router.get('/subscribe', async (ctx, next) => {
  ctx.body = await requestPromise;

  newRequestPromise();
});

router.post('/publish', async (ctx, next) => {
  const message = ctx.request.body.message;

  if (message) {
    requestResolve(message);
  }

  ctx.body = 'ok';

  next();
});

app.use(router.routes());

function newRequestPromise() {
  requestPromise = new Promise((resolve) => {
    requestResolve = resolve;
  });
}

module.exports = app;
