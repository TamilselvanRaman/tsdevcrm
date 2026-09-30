import { handleGetDocument, handleUpdateDocument, handleDeleteDocument } from "@/lib/apiHandler";
import { expenseSchema } from "@/lib/validators";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return handleGetDocument("expenses", params.id);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return handleUpdateDocument("expenses", params.id, request, expenseSchema);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return handleDeleteDocument("expenses", params.id);
}
