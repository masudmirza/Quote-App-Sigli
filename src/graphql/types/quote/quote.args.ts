// graphql/types/quote.args.ts
import { ArgsType, Field, Int } from "type-graphql";
import { QuoteOrderBy } from "../../../enums/quote.enum";
import { QuoteWhereInput } from "./quote.type";

@ArgsType()
export class QuoteConnectionArgs {
  @Field(() => Int, { nullable: true })
  pageSize?: number;

  @Field({ nullable: true })
  after?: string;

  @Field({ nullable: true })
  before?: string;

  @Field(() => QuoteWhereInput, { nullable: true })
  where?: QuoteWhereInput;

  @Field(() => QuoteOrderBy, { nullable: true })
  orderBy?: QuoteOrderBy;
}
