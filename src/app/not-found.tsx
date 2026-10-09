import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10">
        <h1 className="text-9xl font-display font-bold text-foreground mb-4">404</h1>
        <div className="h-1 w-20 bg-primary mx-auto mb-8 rounded-full" />
        <h2 className="text-3xl font-display font-bold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 bg-[#13131A] hover:bg-white/5 border border-white/10 px-6 py-3 rounded-xl transition-colors font-medium text-foreground"
        >
          <ArrowLeft className="w-5 h-5" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
