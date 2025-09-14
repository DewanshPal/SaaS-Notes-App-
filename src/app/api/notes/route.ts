// import { Note } from "@/models/note";
// import { Company } from "@/models/company";

// export async function POST(req: Request) {
//   const user = await requireRole(req, ["admin", "user"]);
//   if (!user) return;

//   // Find tenant
//   const tenant = await Company.findById(user.companyId);
//   if (!tenant) {
//     return Response.json({ error: "Tenant not found" }, { status: 404 });
//   }

//   // Check note limit
//   if (tenant.noteLimit !== null) {
//     const count = await Note.countDocuments({ companyId: tenant._id });
//     if (count >= tenant.noteLimit) {
//       return Response.json({ error: "Note limit reached" }, { status: 403 });
//     }
//   }

//   // Create note
//   const { title, content } = await req.json();
//   const note = await Note.create({
//     title,
//     content,
//     userId: user._id,
//     companyId: tenant._id,
//   });

//   return Response.json(note, { status: 201 });
// }
