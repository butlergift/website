import * as object from '../utils/object';

export function test() {}

/**
 * Get User Details
 */
export async function getUserDetails(firestore, db, args) {
  try {
    const { userId } = args;

    if (!userId) {
      throw new Error('Sign in required!');
    }

    const doc = await firestore.getDoc(firestore.doc(db, 'Users', userId));
    return object.snakeToCamel(doc.data());
  } catch ({ name, message, stack }) {
    return { error: { name, message, stack } };
  }
}
