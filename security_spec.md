# Latha Sarees & Jewelry — Firestore Security Specification

## 1. Data Invariants
1. **Default Deny**: All unmatched paths are strictly denied (`allow read, write: if false;`).
2. **Admin Verification**: Admin privileges require `isSignedIn()`, `request.auth.token.email_verified == true`, and either `exists(/databases/$(database)/documents/admins/$(request.auth.uid))` or the bootstrapped owner email `naushadabdul2006@gmail.com`.
3. **Catalog Integrity (`/products/{productId}`)**: Publicly readable (`get`, `list`), but `create`, `update`, and `delete` are strictly restricted to verified admins with full schema and boundary checks (`isValidProduct`).
4. **PII Isolation (`/users/{userId}/private/{docId}`)**: Customer PII (email, phone, address) is stored under `/users/{userId}/private/{docId}` and strictly accessible only to `request.auth.uid == userId` or `isAdmin()`.
5. **Order Ownership & Terminal Locking (`/orders/{orderId}`)**:
   - Customers can only `create` orders where `incoming().userId == request.auth.uid` and `incoming().status == 'Pending'` and `incoming().createdAt == request.time`.
   - Customers can `get` and `list` only orders where `resource.data.userId == request.auth.uid`.
   - Once an order reaches a terminal state (`Delivered`, `Cancelled`, `Returned`), non-admin updates are locked. Customers may only cancel a `Pending` order via action-based `affectedKeys().hasOnly(['status', 'updatedAt'])`. Admins may update `status`, `paymentStatus`, and `updatedAt`.
6. **Wishlist Ownership (`/wishlists/{wishlistId}`)**: Strictly owned by `userId == request.auth.uid` with `exists(/databases/$(database)/documents/products/$(incoming().productId))` relational verification on creation.

## 2. The "Dirty Dozen" Payloads
1. **Unverified Email Admin Spoof**: Attempting to create a product with `email: "naushadabdul2006@gmail.com"` and `email_verified: false`.
2. **Shadow Field Injection on Order**: Adding `"isVip": true` to `/orders/{orderId}` on create.
3. **Order Identity Spoofing**: Creating an order with `userId: "victim_uid"` while authenticated as `"attacker_uid"`.
4. **Cross-Tenant PII Read**: Authenticated user `"attacker_uid"` attempting `get` on `/users/victim_uid/private/profile`.
5. **Unbounded String Resource Exhaustion**: Creating an order with a 10,000-character `shippingAddress`.
6. **ID Poisoning**: Creating a document with an invalid ID containing spaces or special characters.
7. **Order Status Shortcutting by User**: Customer attempting to create an order directly in `"Delivered"` status or update a `"Shipped"` order to `"Delivered"`.
8. **Terminal State Mutation**: Customer attempting to update an already `"Cancelled"` order back to `"Confirmed"`.
9. **Timestamp Forgery**: Creating an order with a forged past/future `createdAt` timestamp instead of `request.time`.
10. **Immutable Field Mutation**: Updating `userId` or `createdAt` or `totalAmount` on an existing order.
11. **Orphaned Wishlist Creation**: Creating a wishlist item referencing a non-existent `productId`.
12. **Unauthorized Order List Scraping**: Executing an unfiltered `list` query on `/orders` without `where('userId', '==', auth.uid)`.
