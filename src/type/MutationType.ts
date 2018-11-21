import { GraphQLObjectType } from 'graphql';
import TaskMutations from '../modules/task/mutations';

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...TaskMutations,
  }),
});
