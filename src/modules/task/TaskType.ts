import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLObjectTypeConfig,
} from 'graphql';
import { globalIdField, connectionDefinitions } from 'graphql-relay';
import { GraphQLContext } from '../../TypeDefinition';
import { NodeInterface } from '../../interface/NodeInterface';

import { ITask } from './TaskModel';

type ConfigType = GraphQLObjectTypeConfig<ITask, GraphQLContext>;

const TaskTypeConfig: ConfigType = {
  name: 'Task',
  description: 'Represents a Task on the To Do List',
  fields: () => ({
    id: globalIdField('Task'),
    description: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Description of this task',
      resolve: ({ description }) => description,
    },
    checked: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Wheter this task is checked/unchecked',
      resolve: ({ checked }) => checked,
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
  connectionFields: {
    count: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Number of items in this connection',
    },
  },
});

export default TaskType;
