import User from "../models/user.model.js";
import Notification from "../models/notification.model.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const getUserProfile = async (req, res) => {
  const { username } = req.params;
  try {
    const user = await User.findOne({ username }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log("Error in getUserProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const followUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToFollow = await User.findById(id);
    const currentUser = await User.findById(req.user.id);

    if (id === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot follow yourself" });
    }

    if (!userToFollow || !currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const isFollowing = currentUser.following.includes(id);
    if (isFollowing) {
      await User.findByIdAndUpdate(req.user.id, { $pull: { following: id } });
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user.id } });
      return res.status(200).json({ message: "Unfollowed user successfully" });
    } else {
      await User.findByIdAndUpdate(req.user.id, { $push: { following: id } });
      await User.findByIdAndUpdate(id, { $push: { followers: req.user.id } });
      const newNotification = new Notification({
        from: req.user.id,
        to: userToFollow._id,
        type: "follow",
      });
      await newNotification.save();
    }

    await currentUser.save();
    await userToFollow.save();

    res.status(200).json({ message: "Followed user successfully" });
  } catch (error) {
    console.log("Error in followUser:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getSuggestedUsers = async (req, res) => {
  try {
    const userId = req.user._id;
    const userFollowedByMe = await User.findById(userId).select("following");
    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $sample: { size: 10 },
      },
    ]);
    const filteredUsers = users.filter(
      (user) => !userFollowedByMe.following.includes(user._id),
    );
    const suggestedUsers = filteredUsers.slice(0, 4);
    suggestedUsers.forEach((user) => (user.password = null));
    res.status(200).json(suggestedUsers);
  } catch (error) {
    console.log("Error in getSuggestedUsers:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateUserProfile = async (req, res) => {
  const { email, username, fullname, bio, currentPassword, newPassword, link } =
    req.body;
  let { profileImg, coverImg } = req.body;
  const userId = req.user._id;
  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      return res
        .status(400)
        .json({
          message: "Current password is required to set a new password",
        });
    }
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
      if (newPassword.length < 6) {
        return res
          .status(400)
          .json({ message: "New password must be at least 6 characters long" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }
    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/").pop().split(".")[0],
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uploadedResponse.secure_url;
    }
    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/").pop().split(".")[0],
        );
      }
      const uploadedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uploadedResponse.secure_url;
    }
    user.fullname = fullname || user.fullname;
    user.email = email || user.email;
    user.bio = bio || user.bio;
    user.link = link || user.link;
    user.profileImg = profileImg || user.profileImg;
    user.coverImg = coverImg || user.coverImg;
    await user.save();
    user.password = null;
    res.status(200).json({ user });
  } catch (error) {
    console.log("Error in updateUserProfile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


