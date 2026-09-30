import { handleGetCollection, handleCreateDocument } from "@/lib/apiHandler";
import { noteSchema } from "@/lib/validators";

export async function GET() {
  return handleGetCollection("notes");
}

export async function POST(request: Request) {
  return handleCreateDocument("notes", request, noteSchema, "note");
}
