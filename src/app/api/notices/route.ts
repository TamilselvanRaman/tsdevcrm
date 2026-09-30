import { handleGetCollection, handleCreateDocument } from "@/lib/apiHandler";
import { noticeSchema } from "@/lib/validators";

export async function GET() {
  return handleGetCollection("notices");
}

export async function POST(request: Request) {
  return handleCreateDocument("notices", request, noticeSchema, "notice");
}
