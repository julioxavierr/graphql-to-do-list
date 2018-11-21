import { GraphQLNonNull, GraphQLString } from 'graphql';
import { mutationWithClientMutationId, toGlobalId } from 'graphql-relay';

import * as TaskLoader from '../TaskLoader';
import TaskModel from '../TaskModel';
import { TaskConnection } from '../TaskType';

type Input = {
  description: string;
};

export default mutationWithClientMutationId({
  name: 'TaskAdd',
  inputFields: {
    description: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Description of the task that will be created',
    },
  },
  mutateAndGetPayload: async ({ description }: Input) => {
    // Create new record
    // checked defaults to false
    const task = await new TaskModel({
      description,
    }).save();

    return {
      id: task._id,
      error: null,
    };
  },
  outputFields: {
    taskEdge: {
      type: TaskConnection.edgeType,
      resolve: async ({ id }, _, context) => {
        // Load new edge from loader
        const task = await TaskLoader.load(context, id);

        // Returns null if no node was loaded
        if (!task) {
          return null;
        }

        return {
          cursor: toGlobalId('Task', task._id.toString()),
          node: task,
        };
      },
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
