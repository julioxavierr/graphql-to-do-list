import { graphql } from 'graphql';

import { toGlobalId } from 'graphql-relay';
import {
  clearDbAndRestartCounters,
  connectMongoose,
  disconnectMongoose,
  getContext,
  createTask,
} from '../../../../../test/helper';
import { schema } from '../../../../schema';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

it('should delete a task', async () => {
  await createTask();
  await createTask();

  // should delete this task
  const task = await createTask({ description: 'This task will be deleted' });

  // language=GraphQL
  const query = `
    mutation M($task: ID!) {
      TaskDelete(input: {
        task: $task
      }) {
        error
        tasks {
          edges {
            node {
              description
              checked
            }
          }
        }
      }
    }
  `;

  const rootValue = {};
  const context = await getContext({});
  const variables = {
    task: toGlobalId('Task', task._id),
  };

  const result = await graphql(schema, query, rootValue, context, variables);

  expect(result).toMatchSnapshot();
});
