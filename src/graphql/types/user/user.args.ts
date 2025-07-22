import { ArgsType, Field, Int } from "type-graphql";

@ArgsType()
export class LikeQuotesConnectionArgs {
  @Field(() => Int, { nullable: true })
  pageSize?: number;

  @Field({ nullable: true })
  after?: string;

  @Field({ nullable: true })
  before?: string;
}
