import { GraphQLObjectType } from 'graphql';
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
      resolve: (_, args, context) => TaskLoader.loadAll(context),
    },
  }),
});
