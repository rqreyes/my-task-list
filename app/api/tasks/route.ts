import { NextResponse } from "next/server";
import { pool } from "@/app/lib/database";

export async function GET() {
  try {
    const { rows } = await pool.query("SELECT * FROM tasks");

    return NextResponse.json(rows);
  } catch (error) {
    console.error("Database query error:", error);

    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 },
    );
  }
}
