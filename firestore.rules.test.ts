/**
 * Firestore Security Rules Test Suite (Dirty Dozen Verification)
 */
export const dirtyDozenPayloads = [
  {
    name: '1. Unverified Email Admin Spoof',
    collection: 'products',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '2. Shadow Field Injection on Order',
    collection: 'orders',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '3. Order Identity Spoofing',
    collection: 'orders',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '4. Cross-Tenant PII Read',
    collection: 'users/victim_uid/private/info',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '5. Unbounded String Resource Exhaustion',
    collection: 'orders',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '6. ID Poisoning',
    collection: 'orders/invalid$id!',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '7. Order Status Shortcutting by User',
    collection: 'orders',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '8. Terminal State Mutation',
    collection: 'orders',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '9. Timestamp Forgery',
    collection: 'orders',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '10. Immutable Field Mutation',
    collection: 'orders',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '11. Orphaned Wishlist Creation',
    collection: 'wishlists',
    expected: 'PERMISSION_DENIED',
  },
  {
    name: '12. Unauthorized Order List Scraping',
    collection: 'orders',
    expected: 'PERMISSION_DENIED',
  },
];
