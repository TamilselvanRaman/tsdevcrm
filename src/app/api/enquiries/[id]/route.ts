import { handleGetDocument, handleUpdateDocument, handleDeleteDocument } from "@/lib/apiHandler";
import { enquirySchema } from "@/lib/validators";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return handleGetDocument("enquiries", params.id);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return handleUpdateDocument("enquiries", params.id, request, enquirySchema);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return handleDeleteDocument("enquiries", params.id);
}
