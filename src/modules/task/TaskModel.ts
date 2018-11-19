import mongoose, { Document, Model } from 'mongoose';

const schema = new mongoose.Schema(
  {
    description: {
      type: String,
      required: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'task',
  },
);

export interface ITask extends Document {
  description: string;
  checked: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaskModel: Model<ITask> = mongoose.model('Task', schema);

export default TaskModel;
