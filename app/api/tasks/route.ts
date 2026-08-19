import { pool } from "@/app/lib/database";
import { generateId } from "@/app/utils/generateId";

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

    return Response.json({ error: "Failed to get tasks" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { taskItem } = await request.json();
  const taskIdNew = generateId(
    `SELECT id
    FROM tasks
    WHERE id = $1`
  );

  // TODO: add task to database

  try {
    return Response.json(
      {
        message: "Created",
        statusCode: 201,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database query error:", error);

    return Response.json({ error: "Failed to post tasks" }, { status: 500 });
  }
}
