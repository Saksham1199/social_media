import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { v2 as cloudinary } from "cloudinary";
import Notification from "../models/notification.model.js";
export const createPost = async (req, res) => {
  try {
    const { text } = req.body;
    let { img } = req.body;
    const userId = req.user._id.toString();
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (text === "" && img === null) {
      return res
        .status(400)
        .json({ message: "Post text or image is required" });
    }
    if (img) {
      const upload = await cloudinary.uploader.upload(img);
      img = upload.secure_url;
    }
    const newPost = new Post({
      text,
      img,
      user: userId,
    });
    await newPost.save();
    return res
      .status(201)
      .json({ message: "Post created successfully", post: newPost });
  } catch (error) {
    console.log("Error in createPost:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    if (post.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }
    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(imgId);
    }
    await Post.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in deletePost:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// export const commentOnPost = async (req, res) => {
//   try {
//     const { text } = req.body;
//     const postId = req.params.id;
//     const userId = req.user._id;

//     if (!text) {
//       return res.status(400).json({ message: "Comment text is required" });
//     }

//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     post.comments.push({ text, user: userId });
//     await post.save();

//     return res
//       .status(201)
//       .json({ message: "Comment added successfully", post });
//   } catch (error) {
//     console.log("Error in commentOnPost:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };


// export const commentOnPost = async (req, res) => {
//   try {
//     const { text } = req.body;
//     const postId = req.params.id;
//     const userId = req.user._id;

//     if (!text) {
//       return res.status(400).json({ message: "Comment text is required" });
//     }

//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     post.comments.push({ text, user: userId });
//     await post.save();

//     // 🔥 POPULATE BEFORE SENDING RESPONSE
//     const updatedPost = await Post.findById(postId)
//       .populate("user", "-password")
//       .populate("comments.user", "username profileImg");

//     return res.status(201).json({
//       message: "Comment added successfully",
//       post: updatedPost,
//     });
//   } catch (error) {
//     console.log("Error in commentOnPost:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };




export const commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const postId = req.params.id;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({ message: "Comment text is required" });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    post.comments.push({ text, user: userId });
    await post.save();
    if (post.user.toString() !== userId.toString()) {
      await Notification.create({
        from: userId,
        to: post.user,
        type: "comment",
      });
    }
    const updatedPost = await Post.findById(postId)
      .populate("user", "-password")
      .populate("comments.user", "username profileImg");

    return res.status(201).json({
      message: "Comment added successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.log("Error in commentOnPost:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// export const likeOnPost = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { id: postId } = req.params;

//     const post = await Post.findById(postId);
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     const isLiked = post.likes.some(
//       (id) => id.toString() === userId.toString()
//     );

//     if (isLiked) {
//       await Post.updateOne(
//         { _id: postId },
//         { $pull: { likes: userId } }
//       );
//     } else {
//       await Post.updateOne(
//         { _id: postId },
//         { $addToSet: { likes: userId } }
//       );
//     }

//     const updatedPost = await Post.findById(postId)
//       .populate("user", "-password")
//       .populate("comments.user", "-password");

//     return res.status(200).json({ post: updatedPost });
//   } catch (error) {
//     console.log("Error in likeOnPost:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };


// export const likeOnPost = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const { id: postId } = req.params;

//     const post = await Post.findById(postId);
//     const user = await User.findById(userId);

//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }

//     const isLiked = post.likes.some(
//       (id) => id.toString() === userId.toString()
//     );

//     if (isLiked) {
//       // UNLIKE
//       post.likes.pull(userId);
//       user.likedPosts.pull(postId);
//     } else {
//       // LIKE
//       post.likes.push(userId);
//       user.likedPosts.push(postId);
//     }

//     await post.save();
//     await user.save();

//     const updatedPost = await Post.findById(postId)
//       .populate("user", "-password")
//       .populate("comments.user", "-password");

//     return res.status(200).json({ post: updatedPost });
//   } catch (error) {
//     console.log("Error in likeOnPost:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

export const likeOnPost = async (req, res) => {
  try {
    const userId = req.user._id;
    const { id: postId } = req.params;

    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    const isLiked = post.likes.some(
      (id) => id.toString() === userId.toString()
    );

    if (isLiked) {
      // UNLIKE
      post.likes.pull(userId);
      user.likedPosts.pull(postId);
    } else {
      // LIKE
      post.likes.push(userId);
      user.likedPosts.push(postId);

      // 🔔 CREATE NOTIFICATION (IMPORTANT)
      if (post.user.toString() !== userId.toString()) {
        await Notification.create({
          from: userId,
          to: post.user,
          type: "like",
        });
      }
    }

    await post.save();
    await user.save();

    const updatedPost = await Post.findById(postId)
      .populate("user", "-password")
      .populate("comments.user", "-password");

    res.status(200).json({ post: updatedPost });
  } catch (error) {
    console.log("Error in likeOnPost:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });
    if (posts.length === 0) {
      return res.status(404).json([]);
    }
    return res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getAllPosts:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// export const getLikedPosts = async (req, res) => {
//   const userId = req.params.id;
//   try {
//     const user = await User.findById(userId).populate("likedPosts");
//     console.log("User found:", user);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     const likedPosts = await Post.find({ _id: { $in: user.likedPosts } })
//       .populate({
//         path: "user",
//         select: "-password",
//       })
//       .populate({
//         path: "comments.user",
//         select: "-password",
//       });
//     return res.status(200).json(likedPosts);
//   } catch (error) {
//     console.log("Error in getLikedPosts:", error);
//     return res.status(500).json({ message: "Internal server error" });
//   }
// };

export const getLikedPosts = async (req, res) => {
  try {
    const userId = req.user._id; 

    const user = await User.findById(userId).populate("likedPosts");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const likedPosts = await Post.find({
      _id: { $in: user.likedPosts },
    })
      .populate("user", "-password")
      .populate("comments.user", "-password");

    res.status(200).json(likedPosts);
  } catch (error) {
    console.log("Error in getLikedPosts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const getFollowingPosts = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).select("following");

    const posts = await Post.find({
      user: { $in: currentUser.following },
    })
      .populate("user", "-password")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getFollowingPosts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getUserPosts = async (req, res) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const posts = await Post.find({ user: user._id })
      .populate("user", "-password")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    console.log("Error in getUserPosts:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
