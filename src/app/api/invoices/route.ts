import { handleGetCollection, handleCreateDocument } from "@/lib/apiHandler";
import { invoiceSchema } from "@/lib/validators";

export async function GET() {
  return handleGetCollection("invoices");
}

export async function POST(request: Request) {
  return handleCreateDocument("invoices", request, invoiceSchema, "inv");
}
