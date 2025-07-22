import { Args, Query, Resolver, UseMiddleware, Ctx } from "type-graphql";
import { Service } from "typedi";
import { QuoteService } from "../../services/quote.service";
import { isAuth, MyContext } from "../middlewares/auth.middlewares";
import { QuoteConnectionArgs } from "../types/quote/quote.args";
import { QuoteConnection } from "../types/quote/quote.type";

@Service()
@Resolver()
export class QuoteResolver {
  constructor(private readonly quoteService: QuoteService) {}

  @UseMiddleware(isAuth)
  @Query(() => QuoteConnection)
  async quotes(
    @Args() args: QuoteConnectionArgs,
    @Ctx() ctx: MyContext,
  ): Promise<QuoteConnection> {
    return this.quoteService.findAllWithPagination(args, ctx.request.user!.userId);
  }
}
