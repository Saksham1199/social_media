// import { Link } from "react-router-dom";
// import LoadingSpinner from "../../components/common/LoadingSpinner";
// import { IoSettingsOutline } from "react-icons/io5";
// import { FaUser } from "react-icons/fa";
// import { FaHeart } from "react-icons/fa6";
// import { FaRegComment } from "react-icons/fa6";
// import useUserStore from "../../store/user.store.js";
// import { useEffect } from "react";
// const NotificationPage = () => {
//   const { isLoading, notifications, fetchNotifications } = useUserStore();
//   useEffect(() => {
//     fetchNotifications();
//   }, [fetchNotifications]);
//   return (
//     <>
//       <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
//         <div className="flex justify-between items-center p-4 border-b border-gray-700">
//           <p className="font-bold">Notifications</p>
//           <div className="dropdown ">
//             <div tabIndex={0} role="button" className="m-1">
//               <IoSettingsOutline className="w-4" />
//             </div>
//             <ul
//               tabIndex={0}
//               className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
//             >
//               <li>
//                 <a>Delete all notifications</a>
//               </li>
//             </ul>
//           </div>
//         </div>
//         {isLoading && (
//           <div className="flex justify-center h-full items-center">
//             <LoadingSpinner size="lg" />
//           </div>
//         )}
//         {notifications?.length === 0 && (
//           <div className="text-center p-4 font-bold">No notifications 🤔</div>
//         )}
//         {notifications?.map((notification) => (
//           <div className="border-b border-gray-700" key={notification._id}>
//             <div className="flex gap-2 p-4">
//               {notification.type === "follow" && (
//                 <FaUser className="w-7 h-7 text-primary" />
//               )}
//               {notification.type === "like" && (
//                 <FaHeart className="w-7 h-7 text-red-500" />
//               )}
//               {notification.type === "comment" && (
//                 <FaRegComment className="w-7 h-7 text-blue-400" />
//               )}

//               <Link to={`/profile/${notification.from.username}`}>
//                 <div className="avatar">
//                   <div className="w-8 rounded-full">
//                     <img
//                       src={
//                         notification.from.profileImg ||
//                         "/avatar-placeholder.png"
//                       }
//                     />
//                   </div>
//                 </div>
//                 <div className="flex gap-1">
//                   <span className="font-bold">
//                     @{notification.from.username}
//                   </span>{" "}
//                   {notification.type === "follow"
//                     ? "followed you"
//                     : "liked your post"}
//                 </div>
//               </Link>
//             </div>
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };
// export default NotificationPage;




import { Link } from "react-router-dom";
import { useEffect } from "react";

import LoadingSpinner from "../../components/common/LoadingSpinner";
import useUserStore from "../../store/user.store.js";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa6";

const NotificationPage = () => {
  const { isLoading, notifications, fetchNotifications , deleteAllNotifications } = useUserStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleDeleteAll = () => {
    deleteAllNotifications();
  };

  const getNotificationText = (type) => {
    switch (type) {
      case "follow":
        return "followed you";
      case "like":
        return "liked your post";
      case "comment":
        return "commented on your post";
      default:
        return "";
    }
  };

  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <p className="font-bold">Notifications</p>

        <div className="dropdown">
          <div tabIndex={0} role="button" className="m-1">
            <IoSettingsOutline className="w-4" />
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <button onClick={handleDeleteAll}>Delete all notifications</button>
            </li>
          </ul>
        </div>
      </div>

      {/* LOADING */}
      {isLoading && (
        <div className="flex justify-center h-full items-center">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoading && notifications?.length === 0 && (
        <div className="text-center p-4 font-bold">
          No notifications 🤔
        </div>
      )}

      {/* NOTIFICATIONS LIST */}
      {notifications?.map((notification) => (
        <div
          className="border-b border-gray-700"
          key={notification._id}
        >
          <div className="flex gap-3 p-4 items-start">
            {/* ICON */}
            {notification.type === "follow" && (
              <FaUser className="w-7 h-7 text-primary" />
            )}
            {notification.type === "like" && (
              <FaHeart className="w-7 h-7 text-red-500" />
            )}
            {notification.type === "comment" && (
              <FaRegComment className="w-7 h-7 text-blue-400" />
            )}

            {/* CONTENT */}
            <Link
              to={`/profile/${notification.from.username}`}
              className="flex gap-2 items-center"
            >
              <div className="avatar">
                <div className="w-8 rounded-full">
                  <img
                    src={
                      notification.from.profileImg ||
                      "/avatar-placeholder.png"
                    }
                    alt="user"
                  />
                </div>
              </div>

              <div className="flex gap-1 flex-wrap">
                <span className="font-bold">
                  @{notification.from.username}
                </span>
                <span>
                  {getNotificationText(notification.type)}
                </span>
              </div>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationPage;
