import { handleGetCollection, handleCreateDocument } from "@/lib/apiHandler";
import { taskSchema } from "@/lib/validators";

export async function GET() {
  return handleGetCollection("tasks");
}

export async function POST(request: Request) {
  return handleCreateDocument("tasks", request, taskSchema, "task");
}
