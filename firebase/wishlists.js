export function test() {}

/**
 * Get User's wishlist
 */
export async function getUserWishlists(firestore, db, args) {
  try {
    const { userId } = args;

    if (!userId) {
      throw new Error('Sign in required!');
    }

    const querySnapshot = await firestore.getDocs(firestore.query(
      firestore.collection(db, 'Wishlists'),
      firestore.where('user_id', '==', userId),
    ));

    const validWishlists = [];
    const expiredWishlistIds = [];
    const timestampNow = new Date();
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const expires = data.expires.toDate();
      if (expires < timestampNow) {
        expiredWishlistIds.push({ key: data.wishlist_id, value: data });
      } else {
        validWishlists.push({ key: data.wishlist_id, value: data.name });
      }
    });

    // Archive expired user_wishlist
    if (expiredWishlistIds.length > 0) {
      const batch = firestore.writeBatch(db);
      expiredWishlistIds.forEach(({ key: wishlistId, value: data }) => {
        // Add to archive
        batch.set(firestore.doc(db, 'ArchivedWishlists', wishlistId), {
          ...data,
          archived_at: firestore.serverTimestamp(),
        }, { merge: true });

        // Remove from original table
        batch.delete(firestore.doc(db, 'Wishlists', wishlistId));
      });
      await batch.commit();
    }

    return validWishlists;
  } catch ({ name, message, stack }) {
    return { error: { name, message, stack } };
  }
}
