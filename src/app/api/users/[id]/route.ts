import { handleGetDocument, handleUpdateDocument, handleDeleteDocument } from "@/lib/apiHandler";
import { userSchema } from "@/lib/validators";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return handleGetDocument("users", params.id);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return handleUpdateDocument("users", params.id, request, userSchema);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return handleDeleteDocument("users", params.id);
}
