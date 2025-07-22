import { Field, ObjectType, ID, InputType } from "type-graphql";
import { CatalogItem } from "../../../enums/catalog-item.enum";
import { PageInfo } from "../quote/quote.type";

@InputType()
export class CatalogItemWhereInput {
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  categoryId?: string;

  @Field({ nullable: true })
  createdAfter?: Date;

  @Field({ nullable: true })
  createdBefore?: Date;
}

@ObjectType()
export class CatalogItemNode {
  @Field(() => ID)
  id!: string;

  @Field()
  name!: string;

  @Field(() => CatalogItem)
  type!: CatalogItem;

  @Field({ nullable: true })
  parentId?: string;

  @Field(() => CatalogItemNode, { nullable: true })
  parent?: CatalogItemNode;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;
}

@ObjectType()
class CatalogItemEdge {
  @Field(() => CatalogItemNode)
  node!: CatalogItemNode;
}

@ObjectType()
export class CatalogItemConnection {
  @Field(() => [CatalogItemEdge])
  edges!: CatalogItemEdge[];

  @Field(() => PageInfo)
  pageInfo!: PageInfo;

  @Field()
  totalCount!: number;
}
