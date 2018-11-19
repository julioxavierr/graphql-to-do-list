import { GraphQLObjectType, GraphQLString, GraphQLBoolean, GraphQLNonNull, GraphQLObjectTypeConfig } from 'graphql';
import { globalIdField, connectionDefinitions } from 'graphql-relay';
import { GraphQLContext } from '../../TypeDefinition';
import { NodeInterface } from '../../interface/NodeInterface';

import { ITask } from './TaskModel';

type ConfigType = GraphQLObjectTypeConfig<ITask, GraphQLContext>;

const TaskTypeConfig: ConfigType = {
  name: 'Task',
  description: 'Represents a Task',
  fields: () => ({
    id: globalIdField('Task'),
    description: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Description of this task',
      resolve: task => task.description,
    },
    checked: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Wheter this task is checked/unchecked',
    },
    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'date of creation',
      resolve: ({ createdAt }) => createdAt.toISOString(),
    },
    updatedAt: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'date of last update',
      resolve: ({ updatedAt }) => updatedAt && updatedAt.toISOString(),
    },
  }),
  interfaces: () => [NodeInterface],
};

const TaskType = new GraphQLObjectType(TaskTypeConfig);

export const TaskConnection = connectionDefinitions({
  name: 'Task',
  nodeType: TaskType,
});

export default TaskType;
