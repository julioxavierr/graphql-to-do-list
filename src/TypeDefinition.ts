import Dataloader from 'dataloader';

import { ITask } from './modules/task/TaskModel';

type Key = string;

export type Dataloaders = {
  TaskLoader: Dataloader<Key, ITask>;
};

export type GraphQLContext = {
  dataloaders: Dataloaders;
};
