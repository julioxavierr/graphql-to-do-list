import {
  GraphQLFieldConfig,
  GraphQLInterfaceType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLResolveInfo,
  GraphQLTypeResolver,
} from 'graphql/type/definition';
import { GraphQLID } from 'graphql/type/scalars';

type GraphQLNodeDefinitions<GraphQLContext> = {
  nodeInterface: GraphQLInterfaceType;
  nodeField: GraphQLFieldConfig<any, GraphQLContext>;
  nodesField: GraphQLFieldConfig<any, GraphQLContext>;
};

/**
 * Given a function to map from an ID to an underlying object, and a function
 * to map from an underlying object to the concrete GraphQLObjectType it
 * corresponds to, constructs a `Node` interface that objects can implement,
 * and a field config for a `node` root field.
 *
 * If the typeResolver is omitted, object resolution on the interface will be
 * handled with the `isTypeOf` method on object types, as with any GraphQL
 * interface without a provided `resolveType` method.
 */
export function nodeDefinitions<GraphQLContext>(
  idFetcher: (id: string, context: GraphQLContext, info: GraphQLResolveInfo) => any,
  typeResolver?: GraphQLTypeResolver<any, GraphQLContext>,
): GraphQLNodeDefinitions<GraphQLContext> {
  const nodeInterface = new GraphQLInterfaceType({
    name: 'Node',
    description: 'An object with an ID',
    fields: () => ({
      id: {
        type: new GraphQLNonNull(GraphQLID),
        description: 'The id of the object.',
      },
    }),
    resolveType: typeResolver,
  });

  const nodeField = {
    name: 'node',
    description: 'Fetches an object given its ID',
    type: nodeInterface,
    args: {
      id: {
        type: GraphQLID,
        description: 'The ID of an object',
      },
    },
    resolve: (_: any, { id }: { id: string }, context: GraphQLContext, info: GraphQLResolveInfo) => (id ? idFetcher(id, context, info) : null),
  };

  const nodesField = {
    name: 'nodes',
    description: 'Fetches objects given their IDs',
    type: new GraphQLNonNull(new GraphQLList(nodeInterface)),
    args: {
      ids: {
        type: new GraphQLNonNull(new GraphQLList(new GraphQLNonNull(GraphQLID))),
        description: 'The IDs of objects',
      },
    },
    resolve: (_: any, { ids }: { ids: string[] }, context: GraphQLContext, info: GraphQLResolveInfo) => Promise.all(ids.map(id => Promise.resolve(idFetcher(id, context, info)))),
  };

  return { nodeInterface, nodeField, nodesField };
}
