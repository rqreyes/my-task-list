import { pool } from "@/app/lib/database";
import { IDataTaskItem } from "@/app/types/tasks";

// get
// ------------------------------------------------------------
export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT *
      FROM tasks
      ORDER BY id`
    );

    // send response
    return Response.json(rows, { status: 200 });
  } catch (error) {
    console.error("Database query error:", error);

    return Response.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// post
// ------------------------------------------------------------
export async function POST(request: Request) {
  const { is_completed, title }: IDataTaskItem = await request.json();

  // check if title is empty
  if (title === "") {
    return Response.json({ error: "Title is required" }, { status: 400 });
  }

  try {
    // update database
    await pool.query(
      `INSERT INTO tasks (is_completed, title)
      VALUES ($1, $2)`,
      [is_completed, title]
    );

    // send response
    return Response.json(
      {
        message: "Created",
        statusCode: 201,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database query error:", error);

    return Response.json({ error: "Failed to create task" }, { status: 500 });
  }
}
