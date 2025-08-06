import { ArgsType, Field, Int } from "type-graphql";
import { CatalogItemOrderBy } from "../../../domain/enums/catalog-item.enum";
import { CatalogItemWhereInput } from "./catalog-item.types";

@ArgsType()
export class CatalogItemConnectionArgs {
  @Field(() => Int, { nullable: true })
  pageSize?: number;

  @Field({ nullable: true })
  after?: string;

  @Field({ nullable: true })
  before?: string;

  @Field(() => CatalogItemWhereInput, { nullable: true })
  where?: CatalogItemWhereInput;

  @Field(() => CatalogItemOrderBy, { nullable: true })
  orderBy?: CatalogItemOrderBy;
}
