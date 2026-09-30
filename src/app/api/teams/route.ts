import { handleGetCollection, handleCreateDocument } from "@/lib/apiHandler";
import { teamSchema } from "@/lib/validators";

export async function GET() {
  return handleGetCollection("teams");
}

export async function POST(request: Request) {
  return handleCreateDocument("teams", request, teamSchema, "team");
}
