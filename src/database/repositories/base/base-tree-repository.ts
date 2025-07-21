import { DeleteResult, ObjectLiteral, TreeRepository } from "typeorm";
import { InternalServerError } from "../../../utils/errors";

export class BaseTreeRepository<T extends ObjectLiteral> extends TreeRepository<T> {
  async delete(id: string): Promise<DeleteResult> {
    const tableName = this.metadata.tablePath;
    const primaryColumn = this.metadata.primaryColumns[0].databasePath;

    const treeParentRelation = this.metadata.treeParentRelation;
    if (!treeParentRelation) {
      throw new InternalServerError(
        "Entity does not have a tree parent relation configured.",
      );
    }

    const parentPropertyName = treeParentRelation.joinColumns[0].propertyName;
    const parentColumn = treeParentRelation.joinColumns[0].databasePath;

    const closureTable = this.metadata.closureJunctionTable;
    if (!closureTable) {
      throw new InternalServerError("Entity does not have a closure table configured.");
    }

    const closureTableName = closureTable.tablePath;
    const ancestorColumn = closureTable.ancestorColumns[0].databasePath;
    const descendantColumn = closureTable.descendantColumns[0].databasePath;

    const closureNodes = await this.createQueryBuilder()
      .select(`closure.${descendantColumn}`)
      .distinct(true)
      .from(closureTableName, "closure")
      .where(`closure.${ancestorColumn} = :ancestorId`, { ancestorId: id })
      .getRawMany();

    const descendantNodeIds = closureNodes.map((v) => v[`closure_${descendantColumn}`]);

    await this.createQueryBuilder()
      .delete()
      .from(closureTableName)
      .where(`${descendantColumn} IN (:...ids)`, { ids: descendantNodeIds })
      .execute();

    await this.createQueryBuilder()
      .update(tableName, { [parentPropertyName]: null })
      .where(`${parentColumn} IN (:...ids)`, { ids: descendantNodeIds })
      .execute();

    await this.createQueryBuilder()
      .delete()
      .from(tableName)
      .where(`${primaryColumn} IN (:...ids)`, { ids: descendantNodeIds })
      .execute();

    return { raw: descendantNodeIds } as DeleteResult;
  }
}
