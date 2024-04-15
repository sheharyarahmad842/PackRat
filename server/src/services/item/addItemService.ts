// import { prisma } from '../../prisma';
import { Item } from '../../drizzle/methods/Item';
import { ItemPacks } from '../../drizzle/methods/ItemPacks';
import { ItemCategory } from '../../drizzle/methods/itemcategory';
import { ItemOwners } from '../../drizzle/methods/ItemOwners';
import { ItemCategory as categories } from '../../utils/itemCategory';
import { type InsertItemCategory } from '../../db/schema';

/**
 * Generates a new item and adds it to a pack based on the given parameters.
 * @param {string} name - The name of the item.
 * @param {number} weight - The weight of the item.
 * @param {number} quantity - The quantity of the item.
 * @param {string} unit - The unit of measurement for the item.
 * @param {string} packId - The ID of the pack to add the item to.
 * @param {string} type - The category type of the item.
 * @param {string} ownerId - The ID of the owner of the item.
 * @return {object} An object containing the newly created item and the pack ID.
 */
export const addItemService = async (
  name: string,
  weight: number,
  quantity: number,
  unit: string,
  packId: string,
  type: 'Food' | 'Water' | 'Essentials',
  ownerId: string,
): Promise<object> => {
  let category: InsertItemCategory | null;
  if (!categories.includes(type)) {
    throw new Error(`Category must be one of: ${categories.join(', ')}`);
  }
  const itemCategoryClass = new ItemCategory();
  const itemClass = new Item();
  const itemPacksClass = new ItemPacks();
  const itemOwnersClass = new ItemOwners();
  category = await itemCategoryClass.findItemCategory({ name: type });
  if (!category) {
    category = await itemCategoryClass.create({ name: type });
  }
  const item = await itemClass.create({
    name,
    weight,
    quantity,
    unit,
    // packs: [packId],
    categoryId: category.id,
  });

  // await Pack.updateOne({ _id: packId }, { $addToSet: { items: newItem._id } });
  await itemPacksClass.create({ itemId: item.id, packId });
  await itemOwnersClass.create({ itemId: item.id, ownerId });
  // const pack = await packClass.update(
  //   {
  //     itemDocuments: newItem.id,
  //   },
  //   packId,
  // );

  // const updatedItem = await item.update(
  //   {
  //     owners: {
  //       push: pack.owners.map((ownerId) => ownerId),
  //     },
  //   },
  //   newItem.id,
  //   and(eq(itemTable.id, newItem.id)),
  // );

  // return { newItem: updatedItem, packId };
  return item;
};
