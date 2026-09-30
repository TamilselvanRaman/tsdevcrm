import { handleGetCollection, handleCreateDocument } from "@/lib/apiHandler";
import { clientSchema } from "@/lib/validators";

export async function GET() {
  return handleGetCollection("clients");
}

export async function POST(request: Request) {
  return handleCreateDocument("clients", request, clientSchema, "cli");
}
