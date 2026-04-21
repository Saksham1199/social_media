import { create } from "zustand";
import axiosInstance from "../config/axios.js";
import toast from "react-hot-toast";

const usePostsStore = create((set) => ({
  posts: [],
  isPending: false,
  error: null,
  isDeleting: false,
  isLiking: false,

  fetchPosts: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/posts");
      set({ posts: res.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

 createPost: async (postData) => {
  set({ isPending: true, error: null });
  try {
    const res = await axiosInstance.post("/posts", postData);
    set((state) => ({
      posts: [res.data.post, ...state.posts],
      isPending: false,
    }));
    toast.success("Post created successfully!");
  } catch (error) {
    set({
      error: error.response?.data?.message || "Something went wrong",
      isPending: false,
    });
    toast.error("Failed to create post");
  }
},

  deletePost: async (postId) => {
    try {
      set({ isDeleting: true });
      await axiosInstance.delete(`/posts/${postId}`);
      set((state) => ({
        posts: state.posts.filter((post) => post._id !== postId),
        isDeleting: false,
      }));
      toast.success("Post deleted successfully!");
    } catch (error) {
      set({
        error: error.response?.data?.message || "Something went wrong",
        isDeleting: false,
      });
      toast.error("Failed to delete post");
    }
  },
  likeOnPost: async (postId) => {
    try {
      set({ isLiking: true });

      const res = await axiosInstance.post(`/posts/like/${postId}`);

      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId ? res.data.post : post,
        ),
        isLiking: false,
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Something went wrong",
        isLiking: false,
      });
    }
  },
  commentOnPost: async (postId, text) => {
    try {
      const res = await axiosInstance.post(`/posts/comment/${postId}`, {
        text,
      });
      set((state) => ({
        posts: state.posts.map((post) =>
          post._id === postId ? res.data.post : post,
        ),
      }));
    } catch (error) {
      set({
        error: error.response?.data?.message || "Something went wrong",
      });
    }
  },

  fetchForYouPosts: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/posts");
      set({ posts: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchFollowingPosts: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/posts/following");
      set({ posts: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
  fetchLikedPosts: async () => {
  set({ isLoading: true });
  try {
    const res = await axiosInstance.get("/posts/likes");
    set({ posts: res.data, isLoading: false });
  } catch {
    set({ isLoading: false });
  }
},

  fetchUserPosts: async (username) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/posts/user/${username}`);
      set({ posts: res.data, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },
}));

export default usePostsStore;
