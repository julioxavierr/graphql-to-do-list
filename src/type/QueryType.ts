import { GraphQLObjectType, GraphQLBoolean } from 'graphql';
import { NodeField, NodesField } from '../interface/NodeInterface';
import { TaskConnection } from '../modules/task/TaskType';
import * as TaskLoader from '../modules/task/TaskLoader';

export default new GraphQLObjectType({
  name: 'Query',
  description: 'The root of all... queries',
  fields: () => ({
    node: NodeField,
    nodes: NodesField,
    tasks: {
      type: TaskConnection.connectionType,
      description: 'List all tasks',
      args: {
        checked: {
          type: GraphQLBoolean,
          description: 'Wheter the task should be checked or not',
        },
      },
      resolve: (_, args, context) => TaskLoader.loadAll(context, args),
    },
  }),
});
