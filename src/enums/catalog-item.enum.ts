import { registerEnumType } from "type-graphql";

export enum CatalogItem {
  MOOD = "mood",
  TAG = "tag",
}

registerEnumType(CatalogItem, {
  name: "CatalogItem",
});

export enum CatalogItemOrderBy {
  NAME_ASC = "name_asc",
  NAME_DESC = "name_desc",
  CREATED_AT_ASC = "created_at_asc",
  CREATED_AT_DESC = "created_at_desc",
}

registerEnumType(CatalogItemOrderBy, {
  name: "CatalogItemOrderBy",
});
