"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
} from "@/lib/api";


type Notification = {
  id: number;
  notification_type: string;
  title: string;
  message: string;
  booking: number | null;
  url: string;
  is_read: boolean;
  created_at: string;
};


export default function NotificationBell() {
  const router = useRouter();

  const [open, setOpen] =
    useState(false);

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [unreadCount, setUnreadCount] =
    useState(0);


  useEffect(() => {
    loadNotifications();

    const interval =
      setInterval(
        loadNotifications,
        5000
      );

    return () =>
      clearInterval(interval);

  }, []);


  async function loadNotifications() {
    const accessToken =
      localStorage.getItem("access");

    const refreshToken =
      localStorage.getItem("refresh");

    if (!accessToken && !refreshToken) {
      return;
    }

    const token =
      accessToken || "";

    try {
      const [
        notificationData,
        unreadData,
      ] = await Promise.all([
        getNotifications(token),
        getUnreadNotificationCount(
          token
        ),
      ]);

      setNotifications(
        notificationData
      );

      setUnreadCount(
        unreadData.unread_count
      );

    } catch (error) {
      console.error(
        "NOTIFICATION ERROR:",
        error
      );
    }
  }


  async function handleNotificationClick(
    notification: Notification
  ) {
    const token =
      localStorage.getItem("access")
      || "";

    try {
      if (!notification.is_read) {
        await markNotificationRead(
          token,
          notification.id
        );
      }

      setOpen(false);

      await loadNotifications();

      if (notification.url) {
        router.push(
          notification.url
        );
      }

    } catch (error) {
      console.error(
        "NOTIFICATION CLICK ERROR:",
        error
      );
    }
  }


  async function handleMarkAllRead() {
    const token =
      localStorage.getItem("access")
      || "";

    try {
      await markAllNotificationsRead(
        token
      );

      await loadNotifications();

    } catch (error) {
      console.error(
        "MARK ALL ERROR:",
        error
      );
    }
  }


  return (
    <div className="relative">

      <button
        type="button"
        onClick={() =>
          setOpen(
            (current) => !current
          )
        }
        className="relative w-11 h-11 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition"
      >
        <span className="text-xl">
          🔔
        </span>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 99
              ? "99+"
              : unreadCount}
          </span>
        )}
      </button>


      {open && (
        <div className="absolute right-0 mt-3 w-[360px] max-h-[500px] overflow-hidden bg-white border border-gray-200 rounded-2xl shadow-2xl z-[100]">

          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">

            <div>
              <h3 className="font-bold text-lg">
                Notifications
              </h3>

              <p className="text-xs text-gray-400 mt-1">
                {unreadCount} unread
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                onClick={
                  handleMarkAllRead
                }
                className="text-sm text-violet-600 font-semibold hover:text-violet-700"
              >
                Mark all read
              </button>
            )}

          </div>


          <div className="max-h-[420px] overflow-y-auto">

            {notifications.length === 0 ? (

              <div className="p-8 text-center text-gray-400">
                No notifications yet.
              </div>

            ) : (

              notifications.map(
                (notification) => (

                  <button
                    key={
                      notification.id
                    }
                    onClick={() =>
                      handleNotificationClick(
                        notification
                      )
                    }
                    className={`w-full text-left px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition ${
                      !notification.is_read
                        ? "bg-violet-50/60"
                        : "bg-white"
                    }`}
                  >

                    <div className="flex items-start gap-3">

                      <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center shrink-0">
                        🔔
                      </div>

                      <div className="min-w-0 flex-1">

                        <div className="flex items-start justify-between gap-3">

                          <p className="font-semibold text-sm text-gray-900">
                            {
                              notification.title
                            }
                          </p>

                          {!notification.is_read && (
                            <span className="w-2 h-2 rounded-full bg-violet-600 shrink-0 mt-1.5" />
                          )}

                        </div>

                        <p className="text-sm text-gray-500 mt-1 leading-relaxed">
                          {
                            notification.message
                          }
                        </p>

                        <p className="text-[11px] text-gray-400 mt-2">
                          {new Date(
                            notification.created_at
                          ).toLocaleString()}
                        </p>

                      </div>

                    </div>

                  </button>

                )
              )

            )}

          </div>

        </div>
      )}

    </div>
  );
}