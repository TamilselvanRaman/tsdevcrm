import { handleGetCollection, handleCreateDocument } from "@/lib/apiHandler";
import { followUpSchema } from "@/lib/validators";

export async function GET() {
  return handleGetCollection("follow_ups");
}

export async function POST(request: Request) {
  return handleCreateDocument("follow_ups", request, followUpSchema, "fu");
}
