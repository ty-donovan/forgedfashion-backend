var express = require("express");
var router = express.Router();
const { db, auth } = require("./firebase");
const {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} = require("firebase/auth");
const { doc, setDoc } = require("firebase/firestore");

// sign-up
router.post("/sign-up", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  // Create a new user with the given email and password
  createUserWithEmailAndPassword(auth, email, password)
    .then(function (userCredential) {
      // Extract the user object from the UserCredential object
      const user = userCredential.user;

      // Add the user to the database
      addNewUserToDatabase(user.uid, email);

      // Send the user object as a response
      res.status(200).json(user.uid);
    })
    .catch(function (error) {
      console.log("Error creating new user:", error);
      res.status(500).send("Error creating new user.");
    });
});

// helper function for creating a new user in the database
const addNewUserToDatabase = async (userID, email) => {
  try {
    await setDoc(doc(db, "users", userID), {
      email: email,
    });
  } catch (error) {
    console.log("Error creating user:", error);
  }
};

router.post("/login", function (req, res) {
  const email = req.body.email;
  const password = req.body.password;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      res.status(200).send(user.uid);
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error logging in:", errorMessage);
      if (errorCode === "auth/user-not-found") {
        res.status(404).send("User not found");
      } else if (errorCode === "auth/wrong-password") {
        res.status(401).send("Incorrect password");
      } else {
        res.status(errorCode).send(errorMessage);
      }
    });
});

router.post("/logout", function (req, res) {
  signOut(auth)
    .then(() => {
      res.status(200).send("Signed out");
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      res.status(errorCode).send(errorMessage);
    });
});

module.exports = router;
