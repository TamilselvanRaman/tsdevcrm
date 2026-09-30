import { handleGetCollection, handleCreateDocument } from "@/lib/apiHandler";
import { userSchema } from "@/lib/validators";

export async function GET() {
  return handleGetCollection("users");
}

export async function POST(request: Request) {
  return handleCreateDocument("users", request, userSchema, "usr");
}
