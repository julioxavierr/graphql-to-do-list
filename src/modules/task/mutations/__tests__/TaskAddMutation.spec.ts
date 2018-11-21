import { graphql } from 'graphql';

import { clearDbAndRestartCounters, connectMongoose, disconnectMongoose, getContext } from '../../../../../test/helper';
import { schema } from '../../../../schema';

beforeAll(connectMongoose);

beforeEach(clearDbAndRestartCounters);

afterAll(disconnectMongoose);

it('should create a task unchecked by default', async () => {
  // language=GraphQL
  const query = `
    mutation M($description: String!) {
      TaskAdd(input: {
        description: $description
      }) {
        error
        taskEdge {
          node {
            description
            checked
          }
        }
      }
    }
  `;

  const rootValue = {};
  const context = await getContext({});
  const variables = {
    description: 'This is a test task',
  };

  const result = await graphql(schema, query, rootValue, context, variables);

  expect(result).toMatchSnapshot();
});
