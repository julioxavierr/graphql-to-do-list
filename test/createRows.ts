/* eslint-disable no-multi-assign,prefer-const */

import { Task } from '../src/model';

export const restartCounters = () => {
  global.__COUNTERS__ = Object.keys(global.__COUNTERS__).reduce((prev, curr) => ({ ...prev, [curr]: 0 }), {});
};

export const createTask = async (payload: Object = {}) => {
  const n = (global.__COUNTERS__.task += 1);

  return new Task({
    description: `task_${n}`,
    ...payload,
  }).save();
};
