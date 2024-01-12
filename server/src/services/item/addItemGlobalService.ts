import { type InsertItemCategory } from '../../db/schema';
import { Item } from '../../drizzle/methods/Item';
import { ItemCategory } from '../../drizzle/methods/itemcategory';
import { ItemCategory as categories } from '../../utils/itemCategory';
// import { prisma } from '../../prisma';

/**
 * Adds an item to the global service.
 * @param {PrismaClient} prisma - Prisma client.
 * @param {string} name - The name of the item.
 * @param {number} weight - The weight of the item.
 * @param {number} quantity - The quantity of the item.
 * @param {string} unit - The unit of measurement for the item.
 * @param {string} type - The category of the item.
 * @return {Promise<Object>} The newly created item.
 */
export const addItemGlobalService = async (
  name: string,
  weight: number,
  quantity: number,
  unit: string,
  type: string,
): Promise<object> => {
  let category: InsertItemCategory | null;
  if (!categories.includes(type)) {
    throw new Error(`Category must be one of: ${categories.join(', ')}`);
  }
  const itemClass = new Item();
  const itemCategoryClass = new ItemCategory();
  // switch (type) {
  //   case ItemCategoryEnum.FOOD: {
  //     const category = await itemCategory.findUniqueItem({
  //       where: {
  //         name: 'Food',
  //       },
  //     });

  //     let newItem = await item.create({
  //       name,
  //       weight,
  //       quantity,
  //       unit,
  //       categoryDocument: {
  //         id: category.id,
  //       },
  //       global: true,
  //     });
  //     newItem = await item.findUniqueItem({
  //       where: {
  //         id: newItem.id,
  //       },
  //       with: { categoryDocument: { columns: { name: true } } },
  //     });
  //     break;
  //   }
  //   case ItemCategoryEnum.WATER: {
  //     const category = await itemCategory.findUniqueItem({
  //       where: {
  //         name: 'Water',
  //       },
  //     });
  //     newItem = await item.create({
  //       name,
  //       weight,
  //       quantity: 1,
  //       unit,
  //       categoryDocument: {
  //         id: category.id,
  //       },
  //       global: true,
  //     });
  //     newItem = await item.findUniqueItem({
  //       where: {
  //         id: newItem.id,
  //       },
  //       with: {
  //         categoryDocument: {
  //           columns: {
  //             name: true,
  //           },
  //         },
  //       },
  //     });

  //     break;
  //   }
  //   default: {
  //     category = await itemCategory.findUniqueItem({
  //       where: {
  //         name: 'Essentials',
  //       },
  //     });

  //     newItem = await item.create({
  //       name,
  //       weight,
  //       quantity,
  //       unit,
  //       categoryDocument: {
  //         id: category.id,
  //       },
  //       global: true,
  //     });
  //     newItem = await item.findUniqueItem({
  //       where: {
  //         id: newItem.id,
  //       },
  //       with: {
  //         categoryDocument: {
  //           columns: {
  //             name: true,
  //           },
  //         },
  //       },
  //     });
  //     break;
  //   }
  // }
  category = await itemCategoryClass.findItemCategory({ name: type });
  if (!category) {
    category = await itemCategoryClass.create({ name: type });
  }
  const newItem = await itemClass.create({
    name,
    weight,
    quantity,
    unit,
    categoryId: category.id,
    global: true,
  });
  return newItem;
};
