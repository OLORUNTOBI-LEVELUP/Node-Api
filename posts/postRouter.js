const express = require("express");
const posts = require("./postDb");

const router = express.Router();
router.use(express.json());

router.get("/", (req, res) => {
  posts
    .get()
    .then(post => {
      res.status(200).json(post);
    })
    .catch(() => {
      res.status(500).json({
        error: "Internal server error"
      });
    });
});

router.get("/:id", validatePostId, (req, res) => {
  const { id } = req.params;
  posts
    .getById(id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(() => {
      res.status(500).json({
        error: "Internal server error"
      });
    });
});

router.delete("/:id", validatePostId, (req, res) => {
  const { id } = req.params;
  posts
    .remove(id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(() => {
      res.status(500).json({
        error: "Internal server error"
      });
    });
});

router.put("/:id", validatePostId, (req, res) => {
  const { id } = req.params;
  const post = req.body;
  posts
    .update(id, post)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(() => {
      res.status(500).json({
        error: "Internal server error"
      });
    });
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;
  posts
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

module.exports = router;
