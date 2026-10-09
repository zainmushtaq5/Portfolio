import { notFound } from "next/navigation";

export const metadata = {
  title: "Blog | Zain Mushtaq",
  robots: { index: false, follow: false },
};

export default function BlogPage() {
  notFound();
}
