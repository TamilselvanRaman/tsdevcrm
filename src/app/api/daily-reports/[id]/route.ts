import { handleGetDocument, handleUpdateDocument, handleDeleteDocument } from "@/lib/apiHandler";
import { dailyReportSchema } from "@/lib/validators";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  return handleGetDocument("daily_reports", params.id);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  return handleUpdateDocument("daily_reports", params.id, request, dailyReportSchema);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  return handleDeleteDocument("daily_reports", params.id);
}
