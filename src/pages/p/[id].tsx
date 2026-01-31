import { GetServerSideProps } from "next";
import { fetchPaste } from "@/services/paste.service";
import { useEffect, useState } from "react";

type Props = {
  content: string;
  remainingViews: number | null;
  expiresAt: string | null;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  const { id } = ctx.params as { id: string };

  try {
    const paste = await fetchPaste(id, ctx.req);
    return {
      props: {
        content: paste.content,
        remainingViews: paste.remaining_views,
        expiresAt: paste.expires_at,
      },
    };
  } catch {
    return { notFound: true };
  }
};

export default function PastePage({
  content,
  remainingViews,
  expiresAt,
}: Props) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!expiresAt) return;

    const expiry = new Date(expiresAt).getTime();

    const tick = () => {
      const diff = Math.max(
        0,
        Math.floor((expiry - Date.now()) / 1000)
      );
      setSecondsLeft(diff);
    };

    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, [expiresAt]);

  return (
    <main className="page">
      <div className="card">
        <h1 className="title">📄 Paste</h1>

        <pre className="paste">{content}</pre>

        <div className="meta">
          {secondsLeft !== null && (
            <span className="pill warn">
              ⏳ Expires in {secondsLeft}s
            </span>
          )}

          {remainingViews !== null && (
            <span className="pill info">
              👁 {remainingViews} views left
            </span>
          )}
        </div>
      </div>
    </main>
  );
}
