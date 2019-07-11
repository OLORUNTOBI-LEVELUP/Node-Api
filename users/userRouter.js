const express = require("express");
const users = require("./userDb");
const posts = require("../posts/postDb");

const router = express.Router();
router.use(express.json());

router.post("/", validateUser, (req, res) => {
  const user = req.body;
  users
    .insert(user)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(() => {
      res.status(500).json({
        error: "Internal Server Error"
      });
    });
});

router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const text = req.body.text;
  const { id } = req.params;
  posts
    .insert({ text, user_id: id })
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        error: error
      });
    });
});

router.get("/", (req, res) => {
  users
    .get()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(() => {
      res.status(500).json({
        error: "Internal server error"
      });
    });
});

router.get("/:id", validateUserId, (req, res) => {
  const { id } = req.params;
  users
    .getById(id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(500).json({
        error: "Internal server error"
      });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  const { id } = req.params;
  users
    .getUserPosts(id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      res.status(500).json({
        error: error
      });
    });
});

router.delete("/:id", validateUserId, (req, res) => {
  const { id } = req.params;
  users
    .remove(id)
    .then(user => {
      res.status(200).json({
        message: "User Sucessfully deleted"
      });
    })
    .catch(() => {
      res.status(500).json({
        error: "Internal server error"
      });
    });
});

router.put("/:id", validateUserId, (req, res) => {
  const { id } = req.params;
  const user = req.body;
  users
    .update(id, user)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(() => {
      res.status(500).json({
        error: "Internal server error"
      });
    });
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  users
    .getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(404).json({ message: "user not found" });
      }
    })
    .catch(() => {
      res.status(500).json({ message: "unable to process request" });
    });
}

function validateUser(req, res, next) {
  const user = req.body;
  if (user === null) {
    res.status(400).json({ message: "missing user data" });
  } else if (!user.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  const post = req.body;
  if (!post) {
    res.status(400).json({ message: "missing post data" });
  } else if (!post.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;
