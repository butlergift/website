import * as Utils from './Utils';

export function test() {}

/**
 * Get a items by listId from cache or from Firestore
 */
export async function getListItemsById(firestore, db, args) {
  try {
    const { listId } = args;

    if (!listId) {
      throw new Error('List ID required!');
    }

    // const cacheKey = `getListItemsById:${listId}`;
    // if (LRUCache.has(cacheKey)) {
    //   return LRUCache.get(cacheKey);
    // }

    const querySnapshot = await firestore.getDocs(firestore.query(
      firestore.collection(db, 'WishlistItems'),
      firestore.where('wishlist_id', '==', listId),
    ));

    const items = [];
    querySnapshot.forEach((doc) => {
      items.push(Utils.snakeToCamel(doc.data()));
    });

    // 5min TTL
    // LRUCache.set(cacheKey, items, { ttl: CACHE_GET_LIST_ITEMS_SEC });
    return items;
  } catch ({ name, message, stack }) {
    return { error: { name, message, stack } };
  }
}
