import { registerEnumType } from "type-graphql";

export enum QuoteOrderBy {
  CREATED_AT_ASC = "CREATED_AT_ASC",
  CREATED_AT_DESC = "CREATED_AT_DESC",
  AUTHOR_ASC = "AUTHOR_ASC",
  AUTHOR_DESC = "AUTHOR_DESC",
  LIKE_ASC = "LIKE_ASC",
  LIKE_DESC = "LIKE_DESC",
}

registerEnumType(QuoteOrderBy, {
  name: "QuoteOrderBy",
  description: "Ordering options for quotes",
});
