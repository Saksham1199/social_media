import { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton.jsx";
import EditProfileModal from "./EditProfileModel.jsx";

import usePostsStore from "../../store/posts.store.js";
import useAuthStore from "../../store/auth.store.js";
import useUserStore from "../../store/user.store.js";

import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

const ProfilePage = () => {
  const navigate = useNavigate();
  const { username } = useParams();

  const { followUnfollowUser, isFollowLoading } = useUserStore();

  const {
    authUser,
    profileUser,
    fetchProfileUser,
    updateProfileImages,
    authLoading,
    profileLoading,
  } = useAuthStore();

  const { posts, fetchUserPosts, fetchLikedPosts } = usePostsStore();

  const isMyProfile = authUser?.username === username;
  const user = isMyProfile ? authUser : profileUser;

  const [feedType, setFeedType] = useState("posts");

  const [profileImg, setProfileImg] = useState(null);
  const [coverImg, setCoverImg] = useState(null);

  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);
  useEffect(() => {
    if (!authLoading && !authUser) navigate("/login");
  }, [authLoading, authUser, navigate]);

  useEffect(() => {
    if (!isMyProfile && username) fetchProfileUser(username);
  }, [username, isMyProfile, fetchProfileUser]);

  useEffect(() => {
    if (!username) return;
    feedType === "posts"
      ? fetchUserPosts(username)
      : fetchLikedPosts();
  }, [feedType, username]);

  if (authLoading || profileLoading) return <ProfileHeaderSkeleton />;
  if (!user) return <p className="text-center mt-10">User not found</p>;

  const isFollowing = authUser?.following?.includes(user._id);

  const handleImageChange = (e, type) => {
    const file = e.target.files[0];
    if (!file) return; 

    const reader = new FileReader();
    reader.onloadend = () => {
      type === "profile"
        ? setProfileImg(reader.result)
        : setCoverImg(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const saveImages = async () => {
    await updateProfileImages({ profileImg, coverImg });
    setProfileImg(null);
    setCoverImg(null);
  };

  return (
    <div className="flex-[4_4_0] border-r border-gray-700 min-h-screen">
      {/* HEADER */}
      <div className="flex gap-10 px-4 py-2 items-center">
        <Link to="/"><FaArrowLeft /></Link>
        <div>
          <p className="font-bold">{user.fullname}</p>
          <span className="text-sm text-slate-500">{posts.length} posts</span>
        </div>
      </div>

      <div className="relative">
        <img
          src={coverImg || user.coverImg || "/cover.png"}
          className="h-52 w-full object-cover"
        />

        {isMyProfile && (
          <>
            <button
              className="absolute top-2 right-2 bg-gray-800 p-2 rounded-full"
              onClick={() => coverImgRef.current.click()}
            >
              <MdEdit />
            </button>
            <input
              hidden
              ref={coverImgRef}
              type="file"
              onChange={(e) => handleImageChange(e, "cover")}
            />
          </>
        )}

        <div className="absolute -bottom-16 left-4">
          <img
            src={profileImg || user.profileImg || "/avatar-placeholder.png"}
            className="w-32 rounded-full border-4 border-black"
          />

          {isMyProfile && (
            <>
              <MdEdit
                className="absolute bottom-2 right-2 cursor-pointer"
                onClick={() => profileImgRef.current.click()}
              />
              <input
                hidden
                ref={profileImgRef}
                type="file"
                onChange={(e) => handleImageChange(e, "profile")}
              />
            </>
          )}
        </div>
      </div>

      {isMyProfile && (profileImg || coverImg) && (
        <div className="px-4 mt-20">
          <button className="btn btn-primary btn-sm" onClick={saveImages}>
            Save image changes
          </button>
        </div>
      )}

      <div className="flex justify-end px-4 mt-6">
        {isMyProfile ? (
          <EditProfileModal authUser={authUser} />
        ) : (
          <button
            className={`btn btn-sm rounded-full ${
              isFollowing ? "btn-outline" : "btn-primary"
            }`}
            disabled={isFollowLoading}
            onClick={() => followUnfollowUser(user._id)}
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        )}
      </div>

      <div className="px-4 mt-20">
        <p className="font-bold">{user.fullname}</p>
        <p className="text-slate-500">@{user.username}</p>
        <p>{user.bio}</p>

        <div className="flex gap-4 mt-2 text-sm text-slate-500">
          {user.link && (
            <a href={user.link} target="_blank" rel="noreferrer">
              <FaLink /> Website
            </a>
          )}
          <div className="flex items-center gap-1">
            <IoCalendarOutline />
            Joined {new Date(user.createdAt).getFullYear()}
          </div>
        </div>

        <div className="flex gap-4 mt-2">
          <span><b>{user.following.length}</b> Following</span>
          <span><b>{user.followers.length}</b> Followers</span>
        </div>
      </div>

      <div className="flex border-b border-gray-700 mt-4">
        <button
          className={`flex-1 p-3 ${feedType === "posts" && "border-b-4 border-primary"}`}
          onClick={() => setFeedType("posts")}
        >
          Posts
        </button>
        <button
          className={`flex-1 p-3 ${feedType === "likes" && "border-b-4 border-primary"}`}
          onClick={() => setFeedType("likes")}
        >
          Likes
        </button>
      </div>

      <Posts feedType={feedType} username={username} posts={posts} />
    </div>
  );
};

export default ProfilePage;

