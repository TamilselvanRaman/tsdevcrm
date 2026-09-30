import { handleGetCollection, handleCreateDocument } from "@/lib/apiHandler";
import { attendanceSchema } from "@/lib/validators";

export async function GET() {
  return handleGetCollection("attendance");
}

export async function POST(request: Request) {
  return handleCreateDocument("attendance", request, attendanceSchema, "att");
}
