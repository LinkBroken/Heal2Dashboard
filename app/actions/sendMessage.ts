"use server";
import { createClient } from "../utils/supabase/server";

interface SendMessageParams {
  title: string;
  message: string;
  recipientIds: string[] | null; // null for broadcast messages
  type: string;
  senderId: string;
}

export async function sendMessage({
  title,
  message,
  recipientIds,
  type,
  senderId,
}: SendMessageParams) {
  const supabase = await createClient();
  try {
    // If it's a broadcast message (recipientIds is null), create one notification with null recipient_id
    if (recipientIds === null) {
      const { data, error } = await supabase
        .from("notifications")
        .insert({
          sender_id: senderId,
          recipient_ids: null, // null means broadcast to all users
          title,
          message,
          type,
          is_read: false,
        })
        .select();

      if (error) {
        console.error("Error sending broadcast message:", error);
        throw new Error(`Failed to send broadcast message: ${error.message}`);
      }

      return { success: true, data };
    }

    // For individual messages, create one notification with array of recipients
    const { data: notification, error } = await supabase
      .from("notifications")
      .insert({
        sender_id: senderId,
        recipient_ids: recipientIds,
        title,
        message,
        type,
        is_read: false,
      })
      .select();

    if (error) {
      console.error("Error sending individual messages:", error);
      throw new Error(`Failed to send messages: ${error.message}`);
    }
    const { error: statusError } = await supabase
      .from("notification_read_status")
      .insert(
        recipientIds.map((recipientId) => ({
          notification_id: notification?.[0].id,
          recipient_id: recipientId,
          is_read: false,
        }))
      );

    return { success: true, notification };
  } catch (error) {
    console.error("Error in sendMessage:", error);
    throw error;
  }
}

// Function to get current user (admin) ID
export async function getCurrentUserId(): Promise<string> {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("User not authenticated");
  }

  return user.id;
}

// Function to verify user is admin
export async function verifyAdminUser(userId: string): Promise<boolean> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Error verifying admin user:", error);
    return false;
  }

  return data?.role === "admin";
}

// Function to get notifications for a specific user
export async function getUserNotifications(userId: string) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("notifications")
      .select(
        `
        id,
        sender_id,
        recipient_ids,
        title,
        message,
        type,
        is_read,
        created_at,
        read_at,
        profiles!notifications_sender_id_fkey (
          first_name,
          last_name
        )
      `
      )
      .or(`recipient_ids.cs.{${userId}},recipient_ids.is.null`)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching user notifications:", error);
      throw new Error(`Failed to fetch notifications: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in getUserNotifications:", error);
    throw error;
  }
}

// Function to mark notification as read for a specific user
export async function markNotificationAsRead(
  notificationId: string,
  userId: string
) {
  const supabase = await createClient();

  try {
    // First, get the current notification to check if user is a recipient
    const { data: notification, error: fetchError } = await supabase
      .from("notifications")
      .select("recipient_ids, is_read")
      .eq("id", notificationId)
      .single();

    if (fetchError) {
      throw new Error(`Failed to fetch notification: ${fetchError.message}`);
    }

    // Check if user is a recipient (either in array or broadcast message)
    const isRecipient =
      notification.recipient_ids === null ||
      notification.recipient_ids.includes(userId);

    if (!isRecipient) {
      throw new Error("User is not a recipient of this notification");
    }

    // For now, we'll update the is_read field to true
    // In a more complex system, you might want to track read status per user
    const { data, error } = await supabase
      .from("notifications")
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq("id", notificationId)
      .select();

    if (error) {
      console.error("Error marking notification as read:", error);
      throw new Error(`Failed to mark notification as read: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error in markNotificationAsRead:", error);
    throw error;
  }
}

// Function to get unread notification count for a user
export async function getUnreadNotificationCount(userId: string) {
  const supabase = await createClient();

  try {
    const { count, error } = await supabase
      .from("notifications")
      .select("*", { count: "exact", head: true })
      .or(`recipient_ids.cs.{${userId}},recipient_ids.is.null`)
      .eq("is_read", false);

    if (error) {
      console.error("Error fetching unread notification count:", error);
      throw new Error(`Failed to fetch unread count: ${error.message}`);
    }

    return { success: true, count: count || 0 };
  } catch (error) {
    console.error("Error in getUnreadNotificationCount:", error);
    throw error;
  }
}
