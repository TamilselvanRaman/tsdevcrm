import { handleGetCollection, handleCreateDocument } from "@/lib/apiHandler";
import { expenseSchema } from "@/lib/validators";

export async function GET() {
  return handleGetCollection("expenses");
}

export async function POST(request: Request) {
  return handleCreateDocument("expenses", request, expenseSchema, "exp");
}
