import { GraphQLNonNull, GraphQLString, GraphQLID } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import * as TaskLoader from '../TaskLoader';
import TaskModel from '../TaskModel';
import { TaskConnection } from '../TaskType';

type Input = {
  task: string;
};

export default mutationWithClientMutationId({
  name: 'TaskDelete',
  inputFields: {
    task: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'ID of the task that will be deleted',
    },
  },
  mutateAndGetPayload: async ({ task: taskId }: Input) => {
    const task = await TaskModel.findOne({ _id: fromGlobalId(taskId).id });

    if (!task) return { error: 'Invalid task' };

    await TaskModel.deleteOne({ _id: task._id });

    return {
      error: null,
    };
  },
  outputFields: {
    tasks: {
      type: TaskConnection.connectionType,
      resolve: async (_, __, context) => TaskLoader.loadAll(context),
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
