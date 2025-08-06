import { z } from "zod";
import { CatalogItem } from "../domain/enums/catalog-item.enum";

const CatalogItemEnum = z.enum(CatalogItem);

const BaseCatalogItemDto = z.object({
  name: z.string(),
  type: CatalogItemEnum,
  parentId: z.string().length(26).nullable().optional(),
});

export const CreateCatalogItemRequestDto = BaseCatalogItemDto.refine(
  (data) => {
    if (data.type === CatalogItem.MOOD) return !data.parentId;
    if (data.type === CatalogItem.TAG) return !!data.parentId;
    return true;
  },
  {
    message: "Invalid parentId: TAG requires parentId, MOOD must not have parentId",
    path: ["parentId"],
  },
);

export const UpdateCatalogItemRequestDto = z.object({
  name: z.string().min(3).optional(),
  type: CatalogItemEnum.optional(),
});

export const CatalogItemResponseDto = z.object({
  id: z.string().length(26),
  name: z.string(),
  type: CatalogItemEnum,
  parentId: z.string().length(26).nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateCatalogItemRequest = z.infer<typeof CreateCatalogItemRequestDto>;
export type UpdateCatalogItemRequest = z.infer<typeof UpdateCatalogItemRequestDto>;
export type CatalogItemResponse = z.infer<typeof CatalogItemResponseDto>;
