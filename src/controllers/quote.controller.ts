import { Service } from "typedi";
import {
  CreateCatalogItemRequestDto,
  UpdateCatalogItemRequestDto,
} from "../dtos/catalog-item.dto";
import { handleError } from "../helpers/handle-error";
import { CatalogItemService } from "../services/catalog-item.service";
import { CustomResponse } from "../utils/response";
import { QuoteService } from "../services/quote.service";

@Service()
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  async getRandomQuote(request: any, reply: any) {
    try {
      const result = await this.quoteService.getRandomQuote();
      return reply.status(200).send(CustomResponse(200, result));
    } catch (error: any) {
      handleError(error, reply);
    }
  }

  async toggleLike(request: any, reply: any) {
    try {
      const userId = request.user.userId;
      const quoteId = request.params.id;
      const result = await this.quoteService.toggleLike(userId, quoteId);
      return reply.status(200).send(CustomResponse(200, result));
    } catch (error: any) {
      handleError(error, reply);
    }
  }
}
