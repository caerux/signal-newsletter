import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { DraftEditor } from "@/components/drafts/DraftEditor";

type Props = { params: Promise<{ id: string }> };

export default async function DraftPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("drafts")
    .select("id, title, body_md, status, updated_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) notFound();

  return (
    <DraftEditor
      id={data.id as string}
      initialTitle={data.title as string}
      initialBody={data.body_md as string}
      initialStatus={data.status as "draft" | "ready" | "published"}
      updatedAt={data.updated_at as string}
    />
  );
}
