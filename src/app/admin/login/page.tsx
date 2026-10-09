import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifySessionToken } from "@/lib/auth";

export default async function AdminLogin() {
  const token = (await cookies()).get("admin_session")?.value;
  if (verifySessionToken(token)) {
    redirect("/admin");
  }

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex items-center justify-center p-4">
      <div className="bg-[#13131A] border border-white/5 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h1 className="text-2xl font-bold mb-6 text-foreground text-center">Admin Login</h1>
        
        <form action="/api/admin/login" method="POST" className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              required
              className="w-full bg-[#0A0A0F] border border-white/10 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary/50"
            />
          </div>
          <button type="submit" className="w-full bg-primary text-[#0A0A0F] font-bold py-3 rounded-xl hover:bg-primary/90 transition-colors">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
