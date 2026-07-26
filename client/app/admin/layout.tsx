import { redirect } from "next/navigation";
import { auth, clerkClient } from "@clerk/nextjs/server";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const { userId } = await auth();
    if (!userId) redirect("/sign-in");

    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    if (user.publicMetadata?.role !== "admin") {
        redirect("/");
    }

    return (
        <div className="min-h-full bg-surface">
            <AdminNav />
            <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
        </div>
    );
}
