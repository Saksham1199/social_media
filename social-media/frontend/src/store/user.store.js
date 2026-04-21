import { create } from "zustand";
import axiosInstance from "../config/axios.js";
import toast from "react-hot-toast";

const useUserStore = create((set) => ({
  user: null,
  isLoading: false,
  isFollowLoading: false,
  error: null,
  suggestedUsers: [],
  notifications: [],
  isUpdatingProfile: false,
  fetchSuggestedUsers: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/users/suggested");
      set({ suggestedUsers: res.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  followUnfollowUser: async (userId) => {
    set({ isFollowLoading: true });
    try {
      await axiosInstance.post(`/users/follow/${userId}`);
      set({ isFollowLoading: false });
      const suggestedUsers = await axiosInstance.get("/users/suggested");
      set({ suggestedUsers: suggestedUsers.data });
    } catch (error) {
      set({ error: error.message, isFollowLoading: false });
    }
  },
  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/notifications");
      set({ notifications: res.data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
  updateProfile: async (profileData) => {
    set({ isUpdatingProfile: true, error: null });
    try {
      const res = await axiosInstance.post("/users/update", profileData);
      set({ user: res.data, isUpdatingProfile: false });
      toast.success("Profile updated successfully!");
    } catch (error) {
      set({ error: error.message, isUpdatingProfile: false });
      toast.error("Failed to update profile");
    }
  },
 deleteAllNotifications: async () => {
  set({ isLoading: true });
  try {
    await axiosInstance.delete("/notifications");
    set({ notifications: [], isLoading: false });

    toast.success("Notifications deleted successfully!");
  } catch (error) {
    set({ error: error.message, isLoading: false });
    toast.error("Failed to delete notifications");
  }
}


}));
export default useUserStore;
