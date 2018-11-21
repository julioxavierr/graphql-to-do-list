import DataLoader from 'dataloader';
import { Types } from 'mongoose';
import { connectionFromMongoCursor, mongooseLoader } from '@entria/graphql-mongoose-loader';
import { GraphQLContext } from '../../TypeDefinition';
import TaskModel, { ITask } from './TaskModel';

export default class Task {
  id: Types.ObjectId;

  _id: Types.ObjectId;

  description: string;

  checked: boolean;

  createdAt: Date;

  updatedAt: Date;

  constructor(data: ITask) {
    this.id = data.id;
    this._id = data._id;
    this.description = data.description;
    this.checked = data.checked;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

export const getLoader = () => new DataLoader(ids => mongooseLoader(TaskModel, ids));

export const load = async (context: GraphQLContext, id: string | null) => {
  if (!id) {
    return null;
  }

  let data;
  try {
    data = await context.dataloaders.TaskLoader.load(id);
  } catch (err) {
    return null;
  }

  return new Task(data);
};

export const clearCache = ({ dataloaders }: GraphQLContext, id: Types.ObjectId) => dataloaders.TaskLoader.clear(id.toString());

type LoadAllArgs = {
  checked?: boolean;
};

export const loadAll = async (context: GraphQLContext, args: LoadAllArgs) => {
  const { checked } = args;
  const conditions = {
    ...(checked ? { checked } : {}),
  };

  const tasks = TaskModel.find(conditions).sort({ createdAt: -1 });

  return connectionFromMongoCursor({
    cursor: tasks,
    context,
    loader: load,
  });
};
