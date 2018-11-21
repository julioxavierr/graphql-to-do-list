import { graphql } from 'graphql';
import idx from 'idx';

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

it('should check a task', async () => {
  const task = await createTask();

  // language=GraphQL
  const query = `
    mutation M($task: ID!, $checked: Boolean!) {
      TaskCheck(input: {
        task: $task
        checked: $checked
      }) {
        error
        task {
          description
          checked
        }
      }
    }
  `;

  const rootValue = {};
  const context = await getContext({});
  const variables = {
    task: toGlobalId('Task', task._id),
    checked: true,
  };

  const result = await graphql(schema, query, rootValue, context, variables);

  expect(result).toMatchSnapshot();
  expect(idx(result, _ => _.data.TaskCheck.task.checked)).toBe(true);
});

it('should uncheck a task', async () => {
  const task = await createTask({ checked: true });

  // language=GraphQL
  const query = `
    mutation M($task: ID!, $checked: Boolean!) {
      TaskCheck(input: {
        task: $task
        checked: $checked
      }) {
        error
        task {
          description
          checked
        }
      }
    }
  `;

  const rootValue = {};
  const context = await getContext({});
  const variables = {
    task: toGlobalId('Task', task._id),
    checked: false,
  };

  const result = await graphql(schema, query, rootValue, context, variables);

  expect(result).toMatchSnapshot();
  expect(idx(result, _ => _.data.TaskCheck.task.checked)).toBe(false);
});
