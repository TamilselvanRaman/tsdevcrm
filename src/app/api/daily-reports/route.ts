import { handleGetCollection, handleCreateDocument } from "@/lib/apiHandler";
import { dailyReportSchema } from "@/lib/validators";

export async function GET() {
  return handleGetCollection("daily_reports");
}

export async function POST(request: Request) {
  return handleCreateDocument("daily_reports", request, dailyReportSchema, "rep");
}
