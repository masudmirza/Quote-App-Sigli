import { CatalogItemResolver } from "../resolvers/catalog-item.resolver";
import { CatalogItemService } from "../../services/catalog-item.service";
import { CatalogItemLoader } from "../loaders/catalog-item.loader";
import { CatalogItemConnectionArgs } from "../types/catalog-item/catalog-item.args";
import {
  CatalogItemConnection,
  CatalogItemNode,
} from "../types/catalog-item/catalog-item.types";

describe("CatalogItemResolver", () => {
  let resolver: CatalogItemResolver;
  let mockService: Partial<CatalogItemService>;
  let mockLoader: Partial<CatalogItemLoader>;

  beforeEach(() => {
    mockService = {
      findAllWithPagination: jest.fn(),
    };
    mockLoader = {
      byId: {
        load: jest.fn(),
      } as any,
    };

    resolver = new CatalogItemResolver(
      mockService as CatalogItemService,
      mockLoader as CatalogItemLoader,
    );
  });

  describe("catalogItems", () => {
    it("calls service.findAllWithPagination with provided args and returns result", async () => {
      const args: CatalogItemConnectionArgs = { limit: 10, cursor: "cursor" } as any;
      const expectedResult: CatalogItemConnection = {
        edges: [],
        pageInfo: {
          hasNextPage: false,
          hasPreviousPage: false,
        },
        totalCount: 0,
      };

      (mockService.findAllWithPagination as jest.Mock).mockResolvedValue(expectedResult);

      const result = await resolver.catalogItems(args);

      expect(mockService.findAllWithPagination).toHaveBeenCalledWith(args);
      expect(result).toBe(expectedResult);
    });
  });

  describe("parent", () => {
    it("returns null if node.parentId is falsy", async () => {
      const node: CatalogItemNode = { id: "1", parentId: null, name: "Node1" } as any;
      const result = await resolver.parent(node);
      expect(result).toBeNull();
    });

    it("calls loader.byId.load with node.parentId and returns the result", async () => {
      const parentNode = { id: "parent1", name: "Parent Node" } as CatalogItemNode;
      const node: CatalogItemNode = {
        id: "2",
        parentId: "parent1",
        name: "Child Node",
      } as any;

      (mockLoader.byId?.load as jest.Mock).mockResolvedValue(parentNode);

      const result = await resolver.parent(node);

      expect(mockLoader.byId?.load).toHaveBeenCalledWith("parent1");
      expect(result).toBe(parentNode);
    });
  });
});
