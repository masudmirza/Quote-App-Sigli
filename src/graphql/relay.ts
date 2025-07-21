export type ClassType<T> = new (...args: any[]) => T;

export type ConnectionArgs = {
  pageSize?: number;
  after?: string;
  before?: string;
};

export type Connection<T> = {
  edges: { node: T }[];
  pageInfo: {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  totalCount: number;
};

export function getPagingParameters(args: ConnectionArgs) {
  const limit = args.pageSize ?? 10;
  const offset = args.after
    ? parseInt(Buffer.from(args.after, "base64").toString("utf8"))
    : 0;
  return { limit, offset };
}

export function getConnectionFromArray<T>(
  items: T[],
  nodeCls: ClassType<T>,
  args: ConnectionArgs,
  totalCount: number,
): Connection<T> {
  const edges = items.map((node) => ({ node }));
  return {
    edges,
    pageInfo: {
      hasNextPage: args.pageSize ? items.length === args.pageSize : false,
      hasPreviousPage: !!args.before,
    },
    totalCount,
  };
}
