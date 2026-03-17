import {
  FileBadge2,
  FileText,
  Upload,
  X,
  Trash2,
  CheckCircle2,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import PageHeader from "../components/PageHeader";
import { Badge } from "../components/ui";
import { getDocumentStatusColor, percent } from "../lib/helpers";
import { getDocuments, saveDocuments } from "../lib/storage";

export default function DocumentsPage() {
  const [docs, setDocs] = useState(getDocuments());
  const [selectedDocId, setSelectedDocId] = useState("");
  const fileInputRef = useRef(null);

  const readyCount = docs.filter((doc) => doc.status === "Complete").length;
  const progress = useMemo(
    () => percent(readyCount, docs.length),
    [readyCount, docs.length],
  );

  const selectedDoc = docs.find((doc) => doc.id === selectedDocId) || null;

  function sync(next) {
    setDocs(next);
    saveDocuments(next);
  }

  function openUpload(docId) {
    setSelectedDocId(docId);
    fileInputRef.current?.click();
  }

  function uploadToSelected(file) {
    if (!file || !selectedDocId) return;

    const next = docs.map((doc) =>
      doc.id === selectedDocId
        ? {
            ...doc,
            status: "Complete",
            fileName: file.name,
          }
        : doc,
    );

    sync(next);
    setSelectedDocId("");
  }

  function clearDocument(docId) {
    const next = docs.map((doc) =>
      doc.id === docId
        ? {
            ...doc,
            status: "Upload",
            fileName: "",
          }
        : doc,
    );

    sync(next);
  }

  function markPending(docId) {
    const next = docs.map((doc) =>
      doc.id === docId
        ? {
            ...doc,
            status: "Pending",
            fileName: "",
          }
        : doc,
    );

    sync(next);
  }

  function markComplete(docId) {
    const target = docs.find((doc) => doc.id === docId);
    if (!target) return;

    const next = docs.map((doc) =>
      doc.id === docId
        ? {
            ...doc,
            status: "Complete",
            fileName:
              doc.fileName ||
              `${doc.name.toLowerCase().replaceAll(" ", "-")}.pdf`,
          }
        : doc,
    );

    sync(next);
  }

  return (
    <>
      <PageHeader
        title="Document Vault"
        subtitle="Track what is ready for submission"
        showBack
      />

      <div className="card mb-4 p-4">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-slate-600">
            {readyCount} of {docs.length} ready
          </span>
          <span className="font-bold text-ink">{progress}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="app-gradient h-full rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-3">
        <SummaryCard
          label="Complete"
          value={docs.filter((d) => d.status === "Complete").length}
        />
        <SummaryCard
          label="Pending"
          value={docs.filter((d) => d.status === "Pending").length}
        />
        <SummaryCard
          label="Upload"
          value={docs.filter((d) => d.status === "Upload").length}
        />
      </div>

      <div className="space-y-3">
        {docs.map((doc) => (
          <div key={doc.id} className="card p-4">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-600">
                {doc.status === "Complete" ? (
                  <FileBadge2 size={18} />
                ) : (
                  <FileText size={18} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">
                      {doc.name}
                    </p>
                    <p className="mt-1 text-xs text-body">{doc.description}</p>
                  </div>
                  <Badge className={getDocumentStatusColor(doc.status)}>
                    {doc.status}
                  </Badge>
                </div>

                {doc.fileName ? (
                  <p className="mt-2 text-xs text-slate-500">
                    File: {doc.fileName}
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-slate-400">
                    No file uploaded yet
                  </p>
                )}

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    className="secondary-btn !px-3 !py-2"
                    onClick={() => openUpload(doc.id)}
                  >
                    <Upload size={15} className="mr-1 inline-block" />
                    {doc.fileName ? "Replace" : "Upload"}
                  </button>

                  <button
                    className="secondary-btn !px-3 !py-2"
                    onClick={() => markPending(doc.id)}
                  >
                    <X size={15} className="mr-1 inline-block" />
                    Mark Pending
                  </button>

                  <button
                    className="secondary-btn !px-3 !py-2"
                    onClick={() => markComplete(doc.id)}
                  >
                    <CheckCircle2 size={15} className="mr-1 inline-block" />
                    Mark Complete
                  </button>

                  {doc.fileName ? (
                    <button
                      className="secondary-btn !px-3 !py-2"
                      onClick={() => clearDocument(doc.id)}
                    >
                      <Trash2 size={15} className="mr-1 inline-block" />
                      Clear
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 card p-4">
        <button
          className="primary-btn w-full"
          onClick={() => {
            const firstIncomplete = docs.find(
              (doc) => doc.status !== "Complete",
            );
            if (firstIncomplete) {
              openUpload(firstIncomplete.id);
            } else if (docs[0]) {
              openUpload(docs[0].id);
            }
          }}
        >
          <Upload size={16} className="mr-1 inline-block" />
          Quick Upload
        </button>
        <p className="mt-3 text-center text-xs text-body">
          Supported formats: PDF, DOC, DOCX, JPG, PNG up to 10MB
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        className="hidden"
        onChange={(e) => uploadToSelected(e.target.files?.[0])}
      />

      {selectedDoc ? (
        <div className="mt-4 rounded-2xl border border-brand-100 bg-brand-50 p-4">
          <p className="text-sm font-semibold text-brand-700">
            Selected document: {selectedDoc.name}
          </p>
          <p className="mt-1 text-xs text-brand-600">
            The next chosen file will be attached to this document slot.
          </p>
        </div>
      ) : null}
    </>
  );
}

function SummaryCard({ label, value }) {
  return (
    <div className="card p-4 text-center">
      <p className="text-lg font-bold text-ink">{value}</p>
      <p className="text-xs text-body">{label}</p>
    </div>
  );
}
