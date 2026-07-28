import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  getNotifications,
  markNotificationRead,
} from "../services/notificationService";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const navigate = useNavigate();
  const notifRef = useRef(null);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();

      // Only keep unseen (unread) notifications in local state
      const all = res.data.notifications || [];
      setNotifications(all.filter((n) => !n.isRead));
    } catch (err) {
      console.error(err);
    }
  };

  const toggleNotifications = () => {
  if (!showNotifications) {
    fetchNotifications();
  }
  setShowNotifications(!showNotifications);
};

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () =>
      document.removeEventListener(
        "mousedown",
        handler
      );
  }, []);

  const handleNotificationClick = async (notification) => {
    try {
      await markNotificationRead(notification._id);

      fetchNotifications();

      if (notification.claimId) {
        navigate(`/claims/${notification.claimId}`);
      }

      setShowNotifications(false);
    } catch (err) {
      console.error(err);
    }
  };

  // When the dropdown is closed, mark any currently displayed (unread)
  // notifications as read so they disappear next time.
  useEffect(() => {
    if (!showNotifications && notifications.length > 0) {
      // mark each notification as read
      (async () => {
        try {
          await Promise.all(
            notifications.map((n) => markNotificationRead(n._id))
          );
          // clear local unread list after marking
          setNotifications([]);
        } catch (err) {
          console.error(err);
        }
      })();
    }
    // only run when dropdown closes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showNotifications]);

  const unreadCount = notifications.filter(
    (n) => !n.isRead
  ).length;

  return (
    <div className="relative" ref={notifRef}>
      {/* Bell Button */}

      <button
  onClick={toggleNotifications}

        className="relative p-2 rounded-xl transition-all duration-150 hover:bg-gray-100"
      >
        <svg
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.8}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}

      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{
              opacity: 0,
              y: 8,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 8,
              scale: 0.96,
            }}
            transition={{
              duration: 0.18,
            }}
            className="absolute right-0 top-12 w-80 bg-white rounded-2xl overflow-hidden z-50"
            style={{
              border: "1px solid #E5E7EB",
              boxShadow:
                "0 20px 60px rgba(0,0,0,.12)",
            }}
          >
            <div
              className="px-4 py-3 font-bold text-[13px]"
              style={{
                borderBottom: "1px solid #F3F4F6",
              }}
            >
              Notifications
            </div>

            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-[13px] text-gray-500">
                No new notifications
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((n) => (
                  <motion.div
                    key={n._id}
                    whileHover={{
                      backgroundColor: "#F8FAF8",
                    }}
                    onClick={() =>
                      handleNotificationClick(n)
                    }
                    className="cursor-pointer px-4 py-3 border-b border-gray-100"
                  >
                    <div className="flex gap-3">
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-[#5BE63A] mt-2 flex-shrink-0"></span>
                      )}

                      <div>
                        <p className="font-semibold text-[12.5px]">
                          {n.title}
                        </p>

                        <p className="text-[11.5px] text-gray-500 mt-1">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}