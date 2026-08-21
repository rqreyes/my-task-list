import { pool } from "@/app/lib/database";
import { IDataTaskItem } from "@/app/types/tasks";

// PUT
// ------------------------------------------------------------
export async function PUT(request: Request) {
  const { id, is_completed, title }: IDataTaskItem = await request.json();

  try {
    await pool.query(
      `UPDATE tasks
      SET
        is_completed = $1,
        title = $2
      WHERE id = $3`,
      [is_completed, title, id]
    );

    return Response.json(
      {
        message: "OK",
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database query error:", error);

    return Response.json({ error: "Failed to create task" }, { status: 500 });
  }
}

// delete
// ------------------------------------------------------------
export async function DELETE(request: Request) {
  const { id }: IDataTaskItem = await request.json();

  try {
    await pool.query(
      `DELETE FROM tasks
      WHERE id = $1`,
      [id]
    );

    return Response.json(
      {
        message: "OK",
        statusCode: 200,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database query error:", error);

    return Response.json({ error: "Failed to create task" }, { status: 500 });
  }
}
