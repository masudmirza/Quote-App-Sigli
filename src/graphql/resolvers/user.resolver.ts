import { Args, Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import { Service } from "typedi";
import { UserService } from "../../services/user.service";
import { isAuth, MyContext } from "../middlewares/auth.middlewares";
import { QuoteConnection } from "../types/quote/quote.type";
import { LikeQuotesConnectionArgs } from "../types/user/user.args";

@Service()
@Resolver()
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @UseMiddleware(isAuth)
  @Query(() => QuoteConnection)
  async likedQuotes(
    @Args() args: LikeQuotesConnectionArgs,
    @Ctx() ctx: MyContext,
  ): Promise<QuoteConnection> {
    const userId = ctx.request.user!.userId;
    return this.userService.getLikedQuotes(userId, args);
  }
}
