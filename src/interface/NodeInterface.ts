import { fromGlobalId } from 'graphql-relay';
import { Types } from 'mongoose';
import { GraphQLContext } from '../TypeDefinition';

import Task, * as TaskLoader from '../modules/task/TaskLoader';
import TaskType from '../modules/task/TaskType';

import { nodeDefinitions } from './node';

const { nodeField, nodesField, nodeInterface } = nodeDefinitions(
  // Maps from a global id to an object
  async (globalId: Types.ObjectId, context: GraphQLContext) => {
    const { id, type } = fromGlobalId(globalId.toString());

    if (type === 'Task') {
      return TaskLoader.load(context, id);
    }

    return null;
  },
  // Maps from an object to a type
  (obj) => {
    if (obj instanceof Task) {
      return TaskType;
    }

    return null;
  },
);

export const NodeInterface = nodeInterface;
export const NodeField = nodeField;
export const NodesField = nodesField;
