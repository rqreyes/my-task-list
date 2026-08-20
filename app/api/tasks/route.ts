import { pool } from "@/app/lib/database";

// get
// ------------------------------------------------------------
export async function GET() {
  try {
    const { rows } = await pool.query(
      `SELECT *
      FROM tasks`
    );
    const rowsResponse = rows.map((rowItem) => {
      return {
        id: rowItem.id,
        isCompleted: rowItem.is_completed,
        title: rowItem.title,
      };
    });

    return Response.json({ taskList: rowsResponse }, { status: 200 });
  } catch (error) {
    console.error("Database query error:", error);

    return Response.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}

// post
// ------------------------------------------------------------
export async function POST(request: Request) {
  const {
    taskItem: { isCompleted, title },
  } = await request.json();

  try {
    await pool.query(
      `INSERT INTO tasks (is_completed, title)
      VALUES ($1, $2)`,
      [isCompleted, title]
    );

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
