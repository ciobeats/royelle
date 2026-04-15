import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

type ResponseData =
  | { message: string }
  | { error: string };

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  throw new Error("Missing Supabase environment variables.");
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  try {
    const email = String(req.body?.email || "")
      .trim()
      .toLowerCase();

    if (!email || !isValidEmail(email)) {
      return res
        .status(400)
        .json({ error: "Please enter a valid email address." });
    }

    const { error } = await supabase
      .from("waitlist_signups")
      .upsert([{ email }], { onConflict: "email" });

    if (error) {
      console.error("Supabase waitlist error:", error);
      return res.status(500).json({ error: "Could not save your signup." });
    }

    return res
      .status(200)
      .json({ message: "You’re on the waitlist. We’ll keep you posted." });
  } catch (err) {
    console.error("Waitlist API error:", err);
    return res.status(500).json({ error: "Something went wrong." });
  }
}