import { graphql } from 'graphql';
import { toGlobalId } from 'graphql-relay';

import { schema } from '../../../schema';
import {
  getContext,
  connectMongoose,
  clearDbAndRestartCounters,
  disconnectMongoose,
  createTask,
} from '../../../../test/helper';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

it('should load Task', async () => {
  const task = await createTask();

  // language=GraphQL
  const query = `
    query Q($id: ID!) {
      node(id: $id) {
        ... on Task {
          description
          checked
        }
      }
    }
  `;

  const rootValue = {};
  const context = getContext({});
  const variables = { id: toGlobalId('Task', task._id) };

  const result = await graphql(schema, query, rootValue, context, variables);
  const { node } = result.data;

  expect(node.description).toBe(task.description);
  expect(node.checked).toBe(false);
});

it('should load all tasks', async () => {
  for (let i = 0; i < 10; i++) {
    await createTask();
  }

  // language=GraphQL
  const query = `
    query Q {
      tasks {
        edges {
          node {
            description
            checked
          }
        }
      }
    }
  `;

  const rootValue = {};
  const context = getContext({});

  const result = await graphql(schema, query, rootValue, context);

  expect(result).toMatchSnapshot();
});
