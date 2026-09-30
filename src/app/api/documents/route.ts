import { handleGetCollection, handleCreateDocument } from "@/lib/apiHandler";
import { documentSchema } from "@/lib/validators";

export async function GET() {
  return handleGetCollection("documents");
}

export async function POST(request: Request) {
  return handleCreateDocument("documents", request, documentSchema, "doc");
}
