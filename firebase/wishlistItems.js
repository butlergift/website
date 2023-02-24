import Promise from 'bluebird';
import * as object from '../utils/object';

/**
 * Get user item based on itemId
 */
export async function getUserItemById(firestore, db, args) {
  try {
    const { itemId } = args;

    if (!itemId) {
      throw new Error('Item ID required!');
    }

    const snap = await firestore.getDocs(firestore.query(
      firestore.collection(db, 'WishlistItems'),
      firestore.where('product_id', '==', itemId),
      firestore.limit(1),
    ));

    const items = snap?.docs?.map((doc) => object.snakeToCamel(doc.data())) || [];
    return items[0] || {};
  } catch ({ name, message, stack }) {
    return { error: { name, message, stack } };
  }
}

/**
 * Get a items by listId
 */
export async function getUserListItemsById(firestore, db, args) {
  try {
    const { listId } = args;

    if (!listId) {
      throw new Error('List ID required!');
    }

    const snapItemsPromise = firestore.getDocs(firestore.query(
      firestore.collection(db, 'WishlistItems'),
      firestore.where('wishlist_id', '==', listId),
    ));

    const snapListDetailsPromise = firestore.getDocs(firestore.query(
      firestore.collection(db, 'Wishlists'),
      firestore.where('wishlist_id', '==', listId),
      firestore.limit(1),
    ));

    const [snapItems, snapListDetails] = await Promise.all([snapItemsPromise, snapListDetailsPromise]);
    const items = snapItems?.docs?.map((doc) => {
      const item = object.snakeToCamel(doc.data());
      return {
        imageUrl: item.imageUrl,
        productId: item.productId,
        productTags: item.productTags,
        productUrl: item?.affiliateUrl?.length > 0 ? item.affiliateUrl : item.productUrl,
      };
    }) || [];
    const listDetails = (snapListDetails?.docs?.map((doc) => {
      const details = object.snakeToCamel(doc.data());
      const response = {
        name: details.name,
        listId: details.wishlistId,
      };
      if (!details.isDefault) {
        response.expires = details.expires;
      }
      return response;
    }) || [])[0] || {};

    return { items, listDetails };
  } catch ({ name, message, stack }) {
    return { error: { name, message, stack } };
  }
}
