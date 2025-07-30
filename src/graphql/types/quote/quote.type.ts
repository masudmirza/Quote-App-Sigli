import { Field, ObjectType, ID, InputType } from "type-graphql";

@InputType()
export class QuoteWhereInput {
  @Field({ nullable: true })
  quoteContains?: string;

  @Field({ nullable: true })
  author?: string;

  @Field({ nullable: true })
  createdAfter?: Date;

  @Field({ nullable: true })
  createdBefore?: Date;
}

@ObjectType()
export class QuoteNode {
  @Field(() => ID)
  id!: string;

  @Field()
  text!: string;

  @Field()
  author!: string;

  @Field({ nullable: true })
  likeCount?: number;

  @Field()
  createdAt!: Date;
}

@ObjectType()
export class PageInfo {
  @Field()
  hasNextPage!: boolean;

  @Field()
  hasPreviousPage!: boolean;
}

@ObjectType()
class QuoteEdge {
  @Field(() => QuoteNode)
  node!: QuoteNode;
}

@ObjectType()
export class QuoteConnection {
  @Field(() => [QuoteEdge])
  edges!: QuoteEdge[];

  @Field(() => PageInfo)
  pageInfo!: PageInfo;

  @Field()
  totalCount!: number;
}
