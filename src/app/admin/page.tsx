import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

async function checkAuth() {
  const token = (await cookies()).get("admin_session")?.value;
  if (!verifySessionToken(token)) {
    redirect("/admin/login");
  }
}

export default async function AdminDashboard({ searchParams }: { searchParams: { tab?: string } }) {
  await checkAuth();
  
  const tab = searchParams.tab || "chats";

  const [chatSessions, contacts, leads] = await Promise.all([
    prisma.chatSession.findMany({ 
      include: { messages: { orderBy: { createdAt: "asc" } } },
      orderBy: { createdAt: "desc" }
    }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.lead.findMany({ orderBy: { createdAt: "desc" } })
  ]);

  async function markContactRead(formData: FormData) {
    "use server";
    await checkAuth(); // Verify token in every server action
    const id = formData.get("id") as string;
    await prisma.contactMessage.update({ where: { id }, data: { read: true } });
    revalidatePath("/admin");
  }

  return (
    <div className="container mx-auto px-6 py-12 max-w-6xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <form action="/api/admin/logout" method="POST">
          <button type="submit" className="text-sm bg-[#13131A] hover:bg-white/5 border border-white/10 px-4 py-2 rounded-xl transition-colors text-red-400">
            Logout
          </button>
        </form>
      </div>
      
      <div className="flex gap-4 border-b border-white/10 mb-8 pb-4">
        <a href="?tab=chats" className={`font-medium ${tab === "chats" ? "text-primary" : "text-muted-foreground hover:text-white"}`}>Chats ({chatSessions.length})</a>
        <a href="?tab=contacts" className={`font-medium ${tab === "contacts" ? "text-primary" : "text-muted-foreground hover:text-white"}`}>Contacts ({contacts.filter(c => !c.read).length} new)</a>
        <a href="?tab=leads" className={`font-medium ${tab === "leads" ? "text-primary" : "text-muted-foreground hover:text-white"}`}>Leads ({leads.length})</a>
      </div>

      <div className="space-y-6">
        {tab === "chats" && (
          <div className="space-y-8">
            {chatSessions.map(session => (
              <div key={session.id} className="bg-[#13131A] border border-white/5 rounded-xl p-6">
                <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-4">
                  <h3 className="font-mono text-sm text-primary">Session: {session.sessionId}</h3>
                  <span className="text-xs text-muted-foreground">{new Date(session.createdAt).toLocaleString()}</span>
                </div>
                <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                  {session.messages.map(msg => (
                    <div key={msg.id} className={`p-3 rounded-lg text-sm ${msg.role === "user" ? "bg-white/5 ml-auto max-w-[80%]" : "bg-primary/10 text-primary/90 mr-auto max-w-[80%]"}`}>
                      <span className="font-bold block mb-1">{msg.role === "user" ? "User" : "Assistant"}</span>
                      <div className="whitespace-pre-wrap">{msg.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {chatSessions.length === 0 && <p className="text-muted-foreground">No chat sessions found.</p>}
          </div>
        )}

        {tab === "contacts" && (
          <div className="space-y-4">
            {contacts.map(contact => (
              <div key={contact.id} className={`border border-white/5 rounded-xl p-6 ${contact.read ? "bg-[#13131A] opacity-70" : "bg-[#1A1A24]"}`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{contact.name}</h3>
                    <p className="text-sm text-muted-foreground">{contact.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-xs text-muted-foreground">{new Date(contact.createdAt).toLocaleString()}</span>
                    {!contact.read && (
                      <form action={markContactRead}>
                        <input type="hidden" name="id" value={contact.id} />
                        <button type="submit" className="text-xs bg-primary text-black px-3 py-1 rounded-full font-medium hover:bg-primary/80 transition-colors">
                          Mark as Read
                        </button>
                      </form>
                    )}
                  </div>
                </div>
                <div className="text-sm border-t border-white/5 pt-4 mt-2">
                  <p className="mb-2"><strong className="text-muted-foreground">Subject/Project:</strong> {contact.subject}</p>
                  <p className="whitespace-pre-wrap text-foreground/90">{contact.body}</p>
                </div>
              </div>
            ))}
            {contacts.length === 0 && <p className="text-muted-foreground">No contact messages found.</p>}
          </div>
        )}

        {tab === "leads" && (
          <div className="bg-[#13131A] border border-white/5 rounded-xl overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/5">
                <tr>
                  <th className="p-4 font-medium text-muted-foreground">Email</th>
                  <th className="p-4 font-medium text-muted-foreground">Source</th>
                  <th className="p-4 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-medium text-foreground">{lead.email}</td>
                    <td className="p-4 text-muted-foreground">{lead.source || "Unknown"}</td>
                    <td className="p-4 text-muted-foreground">{new Date(lead.createdAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {leads.length === 0 && <p className="p-6 text-muted-foreground text-center">No leads captured yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
