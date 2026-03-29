import {
  FileBadge2,
  FileText,
  Upload,
  PencilLine,
  CheckSquare,
  Square,
  X,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import PageHeader from "../components/PageHeader";
import { Badge } from "../components/ui";
import { getDocumentStatusColor, percent } from "../lib/helpers";
import {
  getCvData,
  getDocuments,
  getUiPrefs,
  saveCvData,
  saveDocuments,
  saveUiPrefs,
} from "../lib/storage";

export default function DocumentsPage() {
  const [docs, setDocs] = useState(getDocuments());
  const [cvData, setCvData] = useState(getCvData());
  const [showCvModal, setShowCvModal] = useState(false);
  const [hideCvBuilder, setHideCvBuilder] = useState(
    getUiPrefs().hideCvBuilder,
  );
  const [uploadTargetId, setUploadTargetId] = useState(null);
  const fileInputRef = useRef(null);

  const readyCount = docs.filter((doc) => doc.status === "Complete").length;
  const progress = useMemo(
    () => percent(readyCount, docs.length),
    [readyCount, docs.length],
  );

  function sync(next) {
    setDocs(next);
    saveDocuments(next);
  }

  function openUploadFor(id) {
    setUploadTargetId(id);
    fileInputRef.current?.click();
  }

  function uploadFileToDoc(file, docId) {
    if (!file || !docId) return;

    const next = docs.map((doc) =>
      doc.id === docId
        ? {
            ...doc,
            status: "Complete",
            fileName: file.name,
          }
        : doc,
    );

    sync(next);
    setUploadTargetId(null);
  }

  function onFileChange(e) {
    const file = e.target.files?.[0];
    uploadFileToDoc(file, uploadTargetId);
    e.target.value = "";
  }

  function toggleHideCvBuilder() {
    const nextValue = !hideCvBuilder;
    setHideCvBuilder(nextValue);

    const prefs = getUiPrefs();
    saveUiPrefs({
      ...prefs,
      hideCvBuilder: nextValue,
    });
  }

  function saveCv() {
    saveCvData(cvData);

    const next = docs.map((doc) =>
      doc.name === "CV Resume"
        ? {
            ...doc,
            status: "Complete",
            fileName: "cv-profile-generated.pdf",
          }
        : doc,
    );

    sync(next);
    setShowCvModal(false);
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

        <div className="mt-4 flex justify-end">
          <button
            className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700"
            onClick={toggleHideCvBuilder}
          >
            {hideCvBuilder ? (
              <CheckSquare size={18} className="text-emerald-600" />
            ) : (
              <Square size={18} className="text-slate-400" />
            )}
            <span>Build CV</span>
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {docs.map((doc) => {
          const isCv = doc.name === "CV Resume";

          return (
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
                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-semibold text-ink">
                        {doc.name}
                      </p>
                      <p className="mt-1 text-xs text-body">
                        {doc.description}
                      </p>
                    </div>

                    <Badge className={getDocumentStatusColor(doc.status)}>
                      {doc.status}
                    </Badge>
                  </div>

                  {doc.fileName ? (
                    <p className="mt-2 break-all text-xs text-slate-500">
                      File: {doc.fileName}
                    </p>
                  ) : null}

                  {!isCv ? (
                    <div className="mt-4 flex justify-end border-t border-slate-100 pt-3">
                      <button
                        className="secondary-btn !px-3 !py-2 text-xs"
                        onClick={() => openUploadFor(doc.id)}
                      >
                        <Upload size={14} className="mr-1 inline-block" />
                        Upload Document
                      </button>
                    </div>
                  ) : null}

                  {isCv && !hideCvBuilder ? (
                    <div className="mt-4 flex justify-end border-t border-slate-100 pt-3">
                      <button
                        className="secondary-btn !px-4 !py-2"
                        onClick={() => setShowCvModal(true)}
                      >
                        <PencilLine size={16} className="mr-1 inline-block" />
                        Build CV
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
        className="hidden"
        onChange={onFileChange}
      />

      {showCvModal ? (
        <div
          className="fixed inset-0 z-40 bg-slate-900/30 p-4"
          onClick={() => setShowCvModal(false)}
        >
          <div
            className="mx-auto mt-8 max-h-[85vh] max-w-app overflow-y-auto rounded-[28px] bg-white p-5 shadow-soft"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="text-lg font-bold text-ink">Build CV</h3>
              <button
                className="icon-btn"
                onClick={() => setShowCvModal(false)}
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Full Name">
                <input
                  className="input"
                  value={cvData.fullName}
                  onChange={(e) =>
                    setCvData((d) => ({ ...d, fullName: e.target.value }))
                  }
                  placeholder="Andrew Ng"
                />
              </Field>

              <Field label="Email">
                <input
                  className="input"
                  value={cvData.email}
                  onChange={(e) =>
                    setCvData((d) => ({ ...d, email: e.target.value }))
                  }
                  placeholder="you@example.com"
                />
              </Field>

              <Field label="Phone">
                <input
                  className="input"
                  value={cvData.phone}
                  onChange={(e) =>
                    setCvData((d) => ({ ...d, phone: e.target.value }))
                  }
                  placeholder="+852 ..."
                />
              </Field>

              <Field label="City">
                <input
                  className="input"
                  value={cvData.city}
                  onChange={(e) =>
                    setCvData((d) => ({ ...d, city: e.target.value }))
                  }
                  placeholder="Hong Kong"
                />
              </Field>

              <Field label="Summary">
                <textarea
                  className="input min-h-[90px]"
                  value={cvData.summary}
                  onChange={(e) =>
                    setCvData((d) => ({ ...d, summary: e.target.value }))
                  }
                  placeholder="Short profile summary"
                />
              </Field>

              <Field label="Education">
                <textarea
                  className="input min-h-[90px]"
                  value={cvData.education}
                  onChange={(e) =>
                    setCvData((d) => ({ ...d, education: e.target.value }))
                  }
                  placeholder="School, GPA, coursework"
                />
              </Field>

              <Field label="Experience">
                <textarea
                  className="input min-h-[90px]"
                  value={cvData.experience || ""}
                  onChange={(e) =>
                    setCvData((d) => ({ ...d, experience: e.target.value }))
                  }
                  placeholder="Internships, work, leadership"
                />
              </Field>

              <Field label="Activities">
                <textarea
                  className="input min-h-[90px]"
                  value={cvData.activities}
                  onChange={(e) =>
                    setCvData((d) => ({ ...d, activities: e.target.value }))
                  }
                  placeholder="Projects, clubs, volunteering"
                />
              </Field>

              <Field label="Awards">
                <textarea
                  className="input min-h-[90px]"
                  value={cvData.awards}
                  onChange={(e) =>
                    setCvData((d) => ({ ...d, awards: e.target.value }))
                  }
                  placeholder="Awards and recognitions"
                />
              </Field>

              <Field label="Skills">
                <textarea
                  className="input min-h-[90px]"
                  value={cvData.skills}
                  onChange={(e) =>
                    setCvData((d) => ({ ...d, skills: e.target.value }))
                  }
                  placeholder="Languages, technical skills, tools"
                />
              </Field>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                className="secondary-btn flex-1"
                onClick={() => setShowCvModal(false)}
              >
                Cancel
              </button>
              <button className="primary-btn flex-1" onClick={saveCv}>
                Save CV
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}
