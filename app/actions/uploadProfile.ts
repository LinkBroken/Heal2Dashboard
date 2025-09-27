"use server";

import { createClient } from "@/app/utils/supabase/server";
import ImageKit from "imagekit";

export async function uploadDoctorProfile({
  userId,
  image,
}: {
  userId: string;
  image: string; // full base64 with prefix
}) {
  const supabase = await createClient();

  const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
  });

  try {
    const result = await new Promise<{ url: string }>((resolve, reject) => {
      imagekit.upload(
        {
          file: image, // must be base64 with prefix or Buffer
          fileName: `${userId}.png`,
          folder: "/heal2gether/avatars",
          overwriteFile: true,
          useUniqueFileName: false,
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        }
      );
    });

    // update doctor row
    const { data, error: updateError } = await supabase
      .from("doctors")
      .update({ picture: result.url })
      .eq("id", userId);

    if (updateError) {
      return {
        error: true,
        message: "Supabase update failed",
        details: updateError.message,
      };
    }

    return {
      success: true,
      message: "Avatar uploaded successfully",
      url: result.url,
    };
  } catch (err) {
    console.error("Upload failed:", err);
    return {
      error: true,
      message: "Internal server error",
      details: String(err),
    };
  }
}

export async function UploadDoctorCertificate({
  userId,
  document,
}: {
  userId: string;
  document: string; // full base64 with prefix
}) {
  const supabase = await createClient();

  const imagekit = new ImageKit({
    publicKey: process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
  });

  try {
    const result = await new Promise<{ url: string }>((resolve, reject) => {
      imagekit.upload(
        {
          file: document, // must be base64 with prefix or Buffer
          fileName: `${userId}.pdf`,
          folder: "/heal2gether/documents",
          overwriteFile: true,
          useUniqueFileName: false,
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve(result);
        }
      );
    });

    // update doctor row
    const { data, error: updateError } = await supabase
      .from("doctors")
      .update({ certificate_url: result.url })
      .eq("id", userId);

    if (updateError) {
      return {
        error: true,
        message: "Supabase update failed",
        details: updateError.message,
      };
    }

    return {
      success: true,
      message: "Document uploaded successfully",
      url: result.url,
    };
  } catch (err) {
    console.error("Upload failed:", err);
    return {
      error: true,
      message: "Internal server error",
      details: String(err),
    };
  }
}
