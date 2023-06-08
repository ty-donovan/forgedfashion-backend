var express = require('express');
var router = express.Router();
const { db } = require('./firebase');
const { doc, getDoc, updateDoc, arrayRemove } = require('firebase/firestore');

// Get all items in cart
router.get('/:cartId', async function (req, res, next) {
  const cartId = req.params.cartId;

  const cartDoc = doc(db, 'carts', cartId);
  const cartSnapshot = await getDoc(cartDoc);

  if (!cartSnapshot.exists()) {
    res.status(404).send('Cart not found');
    return;
  }

  res.json(cartSnapshot.data());
});

// Delete an item from the cart
router.delete('/:cartId/:itemId/:itemSize', async function (req, res, next) {
  const cartId = req.params.cartId;
  const itemId = req.params.itemId;
  const itemSize = req.params.itemSize;

  const cartDoc = doc(db, 'carts', cartId);
  const cartSnapshot = await getDoc(cartDoc);

  if (!cartSnapshot.exists()) {
    res.status(404).send('Cart not found');
    return;
  }

  const items = cartSnapshot.data().items;
  const item = items.find(item => item.id === itemId && item.size === itemSize);

  if (!item) {
    res.status(404).send('Item not found in cart');
    return;
  }

  await updateDoc(cartDoc, {
    items: arrayRemove(item)
  });

  res.status(204).send();
});

// Update the quantity of an item in the cart
router.patch('/:cartId/:itemId/:itemSize', async function (req, res, next) {
  const cartId = req.params.cartId;
  const itemId = req.params.itemId;
  const itemSize = req.params.itemSize;
  const newQuantity = req.body.quantity;

  const cartDoc = doc(db, 'carts', cartId);
  const cartSnapshot = await getDoc(cartDoc);

  if (!cartSnapshot.exists()) {
    res.status(404).send('Cart not found');
    return;
  }

  const items = cartSnapshot.data().items;
  const itemIndex = items.findIndex(item => item.id === itemId && item.size === itemSize);

  if (itemIndex === -1) {
    res.status(404).send('Item not found in cart');
    return;
  }

  // Update the item's quantity
  items[itemIndex].quantity = newQuantity;

  await updateDoc(cartDoc, { items });

  res.status(200).json(items[itemIndex]);
});


module.exports = router;