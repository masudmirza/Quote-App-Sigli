import { CatalogItemLoader } from "../loaders/catalog-item.loader";

describe("CatalogItemLoader", () => {
  it("should batch load catalog items by id", async () => {
    const dbContext = {
      catalogItems: {
        find: jest.fn().mockResolvedValue([
          { id: "1", name: "happy" },
          { id: "2", name: "joy" },
        ]),
      },
    } as any;

    const loader = new CatalogItemLoader(dbContext);
    const result = await loader.byId.loadMany(["1", "2"]);

    expect(result).toEqual([
      { id: "1", name: "happy" },
      { id: "2", name: "joy" },
    ]);
  });
});
