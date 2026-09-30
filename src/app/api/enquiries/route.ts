import { handleGetCollection, handleCreateDocument } from "@/lib/apiHandler";
import { enquirySchema } from "@/lib/validators";

export async function GET() {
  return handleGetCollection("enquiries");
}

export async function POST(request: Request) {
  return handleCreateDocument("enquiries", request, enquirySchema, "enq");
}
