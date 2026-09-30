import { handleGetCollection, handleCreateDocument } from "@/lib/apiHandler";
import { projectSchema } from "@/lib/validators";

export async function GET() {
  return handleGetCollection("projects");
}

export async function POST(request: Request) {
  return handleCreateDocument("projects", request, projectSchema, "prj");
}
