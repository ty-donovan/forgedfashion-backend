var express = require("express");
const axios = require("axios");
var router = express.Router();
const { db } = require("./firebase");
const { doc, updateDoc, getDoc } = require("firebase/firestore");

router.put("/add-to-cart/:userUID", async (req, res, next) => {
  const userUID = req.params.userUID;
  const newItem = req.body;
  const docRef = doc(db, "carts", userUID);
  const cartSnapshot = await getDoc(docRef);
  let oldItems = cartSnapshot.data().items;

  let itemAlreadyInCart = false;

  for (let i = 0; i < oldItems.length; i++) {
    if (
      oldItems[i].name === newItem.name &&
      oldItems[i].size === newItem.size
    ) {
      oldItems[i].quantity = oldItems[i].quantity + 1;
      itemAlreadyInCart = true;
      break;
    }
  }

  if (!itemAlreadyInCart) {
    oldItems.push(newItem);
  }

  await updateDoc(docRef, {
    items: oldItems,
  });
  res.send("Updated Cart.");
});

router.get("/mens/shirts", function (req, res, next) {
  axios
    .get("https://dummyjson.com/products/category/mens-shirts")
    .then((result) => res.json(result.data));
});

router.get("/mens/shoes", function (req, res, next) {
  axios
    .get("https://dummyjson.com/products/category/mens-shoes")
    .then((result) => res.json(result.data));
});

router.get("/mens/watches", function (req, res, next) {
  axios
    .get("https://dummyjson.com/products/category/mens-watches")
    .then((result) => res.json(result.data));
});

router.get("/womens/dresses", function (req, res, next) {
  axios
    .get("https://dummyjson.com/products/category/womens-dresses")
    .then((result) => res.json(result.data));
});

router.get("/womens/shoes", function (req, res, next) {
  axios
    .get("https://dummyjson.com/products/category/womens-shoes")
    .then((result) => res.json(result.data));
});

router.get("/womens/watches", function (req, res, next) {
  axios
    .get("https://dummyjson.com/products/category/womens-watches")
    .then((result) => res.json(result.data));
});

router.get("/womens/bags", function (req, res, next) {
  axios
    .get("https://dummyjson.com/products/category/womens-bags")
    .then((result) => res.json(result.data));
});

router.get("/womens/jewellery", function (req, res, next) {
  axios
    .get("https://dummyjson.com/products/category/womens-jewellery")
    .then((result) => res.json(result.data));
});

module.exports = router;
