import { Service } from "typedi";
import {
  CreateCatalogItemRequestDto,
  UpdateCatalogItemRequestDto,
} from "../dtos/catalog-item.dto";
import { handleError } from "../helpers/handle-error";
import { CatalogItemService } from "../services/catalog-item.service";
import { CustomResponse } from "../utils/response";

@Service()
export class CatalogItemController {
  constructor(private readonly catalogItemService: CatalogItemService) {}

  async create(request: any, reply: any) {
    try {
      const input = CreateCatalogItemRequestDto.parse(request.body);
      const result = await this.catalogItemService.create(input);
      return reply.status(201).send(CustomResponse(201, result));
    } catch (error: any) {
      handleError(error, reply);
    }
  }

  async update(request: any, reply: any) {
    try {
      const input = UpdateCatalogItemRequestDto.parse(request.body);
      const result = await this.catalogItemService.update(request.params.id, input);
      return reply.status(200).send(CustomResponse(200, result));
    } catch (error: any) {
      handleError(error, reply);
    }
  }

  async delete(request: any, reply: any) {
    try {
      const result = await this.catalogItemService.delete(request.params.id);
      return reply.status(200).send(CustomResponse(200, result));
    } catch (error: any) {
      handleError(error, reply);
    }
  }
}
