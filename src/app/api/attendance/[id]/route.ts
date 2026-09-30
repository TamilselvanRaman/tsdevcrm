import { handleGetDocument, handleUpdateDocument, handleDeleteDocument } from "@/lib/apiHandler";
import { attendanceSchema } from "@/lib/validators";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return handleGetDocument("attendance", params.id);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return handleUpdateDocument("attendance", params.id, request, attendanceSchema);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return handleDeleteDocument("attendance", params.id);
}
