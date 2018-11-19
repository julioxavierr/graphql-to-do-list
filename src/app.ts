//
import 'isomorphic-fetch';

import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import cors from 'kcors';
import graphqlHttp from 'koa-graphql';
import graphqlBatchHttpWrapper from 'koa-graphql-batch';
import logger from 'koa-logger';
import Router from 'koa-router';
import { koaPlayground } from 'graphql-playground-middleware';

import { schema } from './schema';
import { jwtSecret } from './config';
import * as loaders from './loader';

const app = new Koa();
const router = new Router();

app.keys = jwtSecret;

const graphqlSettingsPerReq = async (req) => {
  const dataloaders = Object.keys(loaders).reduce(
    (dataloaders, loaderKey) => ({
      ...dataloaders,
      [loaderKey]: loaders[loaderKey].getLoader(),
    }),
    {},
  );

  return {
    graphiql: process.env.NODE_ENV !== 'production',
    schema,
    context: {
      req,
      dataloaders,
    },
    // extensions: ({ document, variables, operationName, result }) => {
    // console.log(print(document));
    // console.log(variables);
    // console.log(result);
    // },
    formatError: (error) => {
      console.log(error.message);
      console.log(error.locations);
      console.log(error.stack);

      return {
        message: error.message,
        locations: error.locations,
        stack: error.stack,
      };
    },
  };
};

const graphqlServer = graphqlHttp(graphqlSettingsPerReq);

// graphql batch query route
router.all('/graphql/batch', bodyParser(), graphqlBatchHttpWrapper(graphqlServer));
router.all('/graphql', graphqlServer);
router.all(
  '/playground',
  koaPlayground({
    endpoint: '/graphql',
  }),
);

app.use(logger());
app.use(cors());
app.use(router.routes()).use(router.allowedMethods());

export default app;
