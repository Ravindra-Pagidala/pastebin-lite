import { useState } from "react";

export default function Home() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState<number | undefined>(60);
  const [views, setViews] = useState<number | undefined>(1);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function createPaste() {
    if (!content.trim()) return;
    setLoading(true);

    const res = await fetch("/api/pastes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content,
        ttl_seconds: ttl,
        max_views: views,
      }),
    });

    const data = await res.json();
    setUrl(data.url);

    setContent("");
    setTtl(60);
    setViews(1);
    setLoading(false);
  }

  return (
    <main className="page">
      <div className="card">
        <h1 className="title">Create a Paste</h1>

        <textarea
          className="textarea"
          placeholder="Paste something…"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="row">
          <select value={ttl ?? ""} onChange={(e) =>
            setTtl(e.target.value === "" ? undefined : Number(e.target.value))
          }>
            <option value="30">30 seconds</option>
            <option value="60">1 minute</option>
            <option value="300">5 minutes</option>
            <option value="">Unlimited</option>
          </select>

          <select value={views ?? ""} onChange={(e) =>
            setViews(e.target.value === "" ? undefined : Number(e.target.value))
          }>
            <option value="1">1 view</option>
            <option value="5">5 views</option>
            <option value="10">10 views</option>
            <option value="">Unlimited</option>
          </select>
        </div>

        <button className="btn" onClick={createPaste} disabled={loading}>
          {loading ? "Creating..." : "Create Paste"}
        </button>

        {url && (
          <div className="result">
            🔗 <a href={url} target="_blank">{url}</a>
            <button className="btn-small" onClick={() => setUrl(null)}>
              Create Another
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          font-family: Arial, Helvetica, sans-serif;
          padding: 2rem;
        }
        .card {
          width: 100%;
          max-width: 600px;
          background: rgba(255, 255, 255, 0.1);
          padding: 2rem;
          border-radius: 24px;
          box-shadow: 0 25px 45px rgba(0,0,0,0.2);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.2);
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .title {
          text-align: center;
          margin-bottom: 1rem;
          font-size: 2rem;
          font-weight: bold;
          background: linear-gradient(135deg, #fff9f9, rgba(255,255,255,0.8));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .textarea {
          width: 100%;
          padding: 1rem;
          border-radius: 12px;
          border: 2px solid rgba(255,255,255,0.3);
          resize: vertical;
          min-height: 150px;
          font-size: 1rem;
          background: rgba(255,255,255,0.9);
          color: #333;
          font-family: monospace;
          
          /* ✅ BLACK PLACEHOLDER */
          ::placeholder {
            color: #000 !important;
            opacity: 1;
          }
        }
        .row {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
        }
        select {
          flex: 1;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 1rem;
          border: 2px solid rgba(255,255,255,0.3);
          background: rgba(255,255,255,0.9);
          color: #333;
        }
        .btn {
          padding: 0.75rem;
          border-radius: 12px;
          border: none;
          background: rgba(255, 193, 7, 0.9);
          color: #fff;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(255, 193, 7, 0.4);
        }
        .btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 193, 7, 0.5);
        }
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .btn-small {
          margin-top: 1rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          border: none;
          background: rgba(255, 193, 7, 0.9);
          color: #fff;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 15px rgba(255, 193, 7, 0.4);
        }
        .btn-small:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(255, 193, 7, 0.5);
        }
        .result {
          margin-top: 1rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }
        a {
          color: #fff;
          text-decoration: underline;
          word-break: break-all;
          text-align: center;
          padding: 0.5rem;
          background: rgba(255,255,255,0.2);
          border-radius: 8px;
        }
      `}</style>
    </main>
  );
}
