import { GraphQLNonNull, GraphQLString, GraphQLID, GraphQLBoolean } from 'graphql';
import { mutationWithClientMutationId, fromGlobalId } from 'graphql-relay';

import * as TaskLoader from '../TaskLoader';
import TaskModel from '../TaskModel';
import TaskType from '../TaskType';

type Input = {
  task: string;
  checked: boolean;
};

export default mutationWithClientMutationId({
  name: 'TaskCheck',
  inputFields: {
    task: {
      type: new GraphQLNonNull(GraphQLID),
      description: 'ID of the task that will be modified',
    },
    checked: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Wheter is to check or uncheck the task',
    },
  },
  mutateAndGetPayload: async ({ task: taskId, checked }: Input) => {
    const task = await TaskModel.findOne({ _id: fromGlobalId(taskId).id });

    if (!task) return { error: 'Invalid task' };

    await task.update({ checked });

    return {
      id: task._id,
      error: null,
    };
  },
  outputFields: {
    task: {
      type: TaskType,
      resolve: async (obj, _, context) => TaskLoader.load(context, obj.id),
    },
    error: {
      type: GraphQLString,
      resolve: ({ error }) => error,
    },
  },
});
