import { Args, Query, Resolver, FieldResolver, Root } from "type-graphql";
import { Service } from "typedi";
import { CatalogItemService } from "../../services/catalog-item.service";
import {
  CatalogItemConnection,
  CatalogItemNode,
} from "../types/catalog-item/catalog-item.types";
import { CatalogItemConnectionArgs } from "../types/catalog-item/catalog-item.args";
import { CatalogItemLoader } from "../loaders/catalog-item.loader";

@Service()
@Resolver(() => CatalogItemNode)
export class CatalogItemResolver {
  constructor(
    private readonly catalogItemService: CatalogItemService,
    private readonly catalogItemLoader: CatalogItemLoader,
  ) {}

  @Query(() => CatalogItemConnection)
  async catalogItems(@Args() args: CatalogItemConnectionArgs) {
    return this.catalogItemService.findAllWithPagination(args);
  }

  @FieldResolver(() => CatalogItemNode, { nullable: true })
  async parent(@Root() node: CatalogItemNode): Promise<CatalogItemNode | null> {
    if (!node.parentId) return null;
    return this.catalogItemLoader.byId.load(node.parentId);
  }
}
