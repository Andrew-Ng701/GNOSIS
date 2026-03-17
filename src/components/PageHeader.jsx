import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PageHeader({
  title,
  subtitle,
  showBack = false,
  right,
}) {
  const navigate = useNavigate();

  return (
    <div className="mb-5 flex items-start justify-between gap-3">
      <div className="flex items-start gap-3">
        {showBack && (
          <button className="icon-btn" onClick={() => navigate(-1)}>
            <ChevronLeft size={18} />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-ink">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-1 text-sm text-body">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {right}
    </div>
  );
}
