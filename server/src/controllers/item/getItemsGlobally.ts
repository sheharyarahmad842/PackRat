import { publicProcedure } from '../../trpc';
import { getItemsGloballyService } from '../../services/item/item.service';
import { z } from 'zod';

/**
 * Retrieves globally available items.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @return {Object} The items, page, and total pages.
 */
// export const getItemsGlobally = async (req, res, next) => {
//   try {
//     const result = await getItemsGloballyService(
//       req.query.limit,
//       req.query.page,
//     );

//     res.locals.data = result;
//     responseHandler(res);
//   } catch (error) {
//     next(ItemNotFoundError);
//   }
// };

export function getItemsGloballyRoute() {
  return publicProcedure
    .input(
      z.object({
        limit: z.number(),
        page: z.number(),
        // searchString: z.string().optional(),
      }),
    )
    .query(async (opts) => {
      const { limit, page } = opts.input;
      const result = await getItemsGloballyService(limit, page);
      return {
        ...result,
        items: result.items,
      };
    });
}
