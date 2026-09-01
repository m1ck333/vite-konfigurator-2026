import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { faPrint } from "@fortawesome/free-solid-svg-icons";

import SectionHeading from "../components/ui/SectionHeading";
import Loading from "../components/ui/Loading";
import Error from "../components/ui/Error";
import Button from "../components/ui/Button";
import { selectUserToken } from "../features/user/userSlice";
import { useInquiries, Inquiry } from "../hooks/useInquiries";

const API = process.env.REACT_APP_API_URL;

// The stored `config` is a JSON string of an object keyed by section: { construction:{title,data}, ... }.
// Parse it and return the sections as an ordered list; tolerate missing/empty/legacy `{}`.
type Section = { title?: string; data?: Record<string, unknown> };
const parseSections = (config?: string | null): Section[] => {
  if (!config) return [];
  try {
    const parsed = JSON.parse(config);
    const raw = Array.isArray(parsed) ? parsed : Object.values(parsed || {});
    return raw.filter((s: unknown): s is Section => !!s && typeof s === "object");
  } catch {
    return [];
  }
};

const sectionEntries = (s: Section) =>
  Object.entries(s.data || {}).filter(([, v]) => v != null && v !== "");

// Off-screen printable sheet: sender + full configuration + door images. react-to-print
// clones this into the print iframe (with the page styles), so the browser's print dialog
// turns it into a shareable PDF/paper for non-admins.
const InquirySheet = React.forwardRef<
  HTMLDivElement,
  { inquiry: Inquiry; sections: Section[]; outerUrl?: string; innerUrl?: string; t: (k: string) => string }
>(({ inquiry, sections, outerUrl, innerUrl, t }, ref) => {
  const details: [string, unknown][] = [
    [t("fullName"), inquiry.name],
    [t("email"), inquiry.email],
    [t("phone"), inquiry.phone],
    [t("message"), inquiry.message],
  ];
  return (
    <div ref={ref} className="bg-white p-8 text-primary-grey-dark" style={{ width: "210mm" }}>
      <div className="mb-5 flex items-baseline justify-between border-b-2 border-primary-green pb-2">
        <h1 className="text-xl font-bold text-primary-green">Algreen — {t("inquiry")}</h1>
        <span className="text-sm text-primary-grey">
          #{inquiry.id}
          {inquiry.created_at ? ` · ${new Date(inquiry.created_at).toLocaleString()}` : ""}
        </span>
      </div>

      <table className="mb-5 w-full text-sm">
        <tbody>
          {details
            .filter(([, v]) => v)
            .map(([k, v]) => (
              <tr key={k}>
                <td className="whitespace-nowrap py-1 pr-6 align-top text-primary-grey">{k}</td>
                <td className="py-1 font-medium">{String(v)}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {sections.map((s, i) => {
        const entries = sectionEntries(s);
        if (!entries.length) return null;
        return (
          <div key={i} className="mb-3">
            <h3 className="mb-1 bg-primary-grey-lightest px-2 py-1 text-sm font-bold text-primary-green">
              {s.title}
            </h3>
            <table className="w-full text-sm">
              <tbody>
                {entries.map(([k, v], j) => (
                  <tr key={k} className={j % 2 === 0 ? "bg-primary-grey-lightest/30" : ""}>
                    <td className="w-1/2 px-2 py-1 align-top text-primary-grey">{k}</td>
                    <td className="px-2 py-1 font-medium">
                      {typeof v === "object" ? JSON.stringify(v) : String(v)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}

      {(outerUrl || innerUrl) && (
        <div className="mt-6 flex flex-wrap items-start justify-center gap-8">
          {outerUrl && (
            <figure className="text-center">
              <img src={outerUrl} alt={t("door-exterior")} className="max-h-[320px] w-auto" />
              <figcaption className="mt-1 text-xs text-primary-grey">{t("door-exterior")}</figcaption>
            </figure>
          )}
          {innerUrl && (
            <figure className="text-center">
              <img src={innerUrl} alt={t("door-interior")} className="max-h-[320px] w-auto" />
              <figcaption className="mt-1 text-xs text-primary-grey">{t("door-interior")}</figcaption>
            </figure>
          )}
        </div>
      )}
    </div>
  );
});
InquirySheet.displayName = "InquirySheet";

const InquiryCard: React.FC<{ inquiry: Inquiry; t: (k: string) => string }> = ({ inquiry, t }) => {
  const token = useSelector(selectUserToken);
  const sections = parseSections(inquiry.config);
  const [outerUrl, setOuterUrl] = useState<string>();
  const [innerUrl, setInnerUrl] = useState<string>();
  const sheetRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => sheetRef.current,
    documentTitle: `Algreen-upit-${inquiry.id}`,
    pageStyle: "@page { size: A4; margin: 12mm; } @media print { body { -webkit-print-color-adjust: exact; } }",
  });

  // Fetch the stored door images with the admin token (img tags can't send auth headers),
  // then expose them as object URLs for both the on-screen preview and the printable sheet.
  useEffect(() => {
    if (!token) return;
    const urls: string[] = [];
    let cancelled = false;
    const load = async (which: "outer" | "inner", set: (u: string) => void) => {
      try {
        const r = await fetch(`${API}/api/admin/inquiries/${inquiry.id}/image/${which}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!r.ok) return;
        const url = URL.createObjectURL(await r.blob());
        if (cancelled) return URL.revokeObjectURL(url);
        urls.push(url);
        set(url);
      } catch {
        /* no image stored for this inquiry — fine */
      }
    };
    load("outer", setOuterUrl);
    load("inner", setInnerUrl);
    return () => {
      cancelled = true;
      urls.forEach(URL.revokeObjectURL);
    };
  }, [token, inquiry.id]);

  const details: [string, unknown][] = [
    [t("email"), inquiry.email],
    [t("phone"), inquiry.phone],
  ];

  return (
    <div className="rounded-2xl border border-primary-grey-lightest bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-primary-grey-lightest pb-3">
        <h3 className="text-base font-semibold text-primary-grey-dark">
          {inquiry.name || t("inquiry")} <span className="font-normal text-primary-grey">#{inquiry.id}</span>
        </h3>
        <div className="flex items-center gap-3">
          {inquiry.created_at && (
            <span className="text-xs text-primary-grey">{new Date(inquiry.created_at).toLocaleString()}</span>
          )}
          <Button variant="primary-green" size="sm" icon={faPrint} onClick={handlePrint}>
            {t("print-pdf")}
          </Button>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-1 gap-x-8 gap-y-1 text-sm sm:grid-cols-2">
        {details
          .filter(([, v]) => v)
          .map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <span className="text-primary-grey">{k}:</span>
              <span className="font-medium text-primary-grey-dark">{String(v)}</span>
            </div>
          ))}
      </div>

      {inquiry.message && (
        <p className="mb-3 rounded-lg bg-primary-grey-lightest/40 p-3 text-sm text-primary-grey-dark">
          {inquiry.message}
        </p>
      )}

      {(outerUrl || innerUrl) && (
        <div className="mb-3 flex flex-wrap gap-4">
          {outerUrl && <img src={outerUrl} alt={t("door-exterior")} className="h-40 w-auto rounded-lg border border-primary-grey-lightest" />}
          {innerUrl && <img src={innerUrl} alt={t("door-interior")} className="h-40 w-auto rounded-lg border border-primary-grey-lightest" />}
        </div>
      )}

      {sections.length > 0 ? (
        <div className="space-y-3">
          {sections.map((s, i) => {
            const entries = sectionEntries(s);
            if (!entries.length) return null;
            return (
              <div key={i}>
                <h4 className="mb-1 text-sm font-semibold text-primary-green">{s.title}</h4>
                <table className="w-full text-sm">
                  <tbody>
                    {entries.map(([k, v]) => (
                      <tr key={k} className="align-top">
                        <td className="whitespace-nowrap py-0.5 pr-4 text-primary-grey">{k}</td>
                        <td className="py-0.5 text-primary-grey-dark">
                          {typeof v === "object" ? JSON.stringify(v) : String(v)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm italic text-primary-grey">{t("no-configuration-data")}</p>
      )}

      {/* Off-screen printable sheet (kept in the DOM so its images are loaded before printing). */}
      <div style={{ position: "absolute", left: "-99999px", top: 0 }} aria-hidden>
        <InquirySheet inquiry={inquiry} sections={sections} outerUrl={outerUrl} innerUrl={innerUrl} t={t} />
      </div>
    </div>
  );
};

const InquiriesPage: React.FC = () => {
  const { t } = useTranslation();
  const { inquiries, isLoading, isError } = useInquiries();

  return (
    <div className="mx-auto w-full max-w-4xl p-4 sm:p-8">
      <SectionHeading>{t("inquiries")}</SectionHeading>
      {isLoading ? (
        <div className="flex justify-center py-16">
          <Loading size="lg" />
        </div>
      ) : isError ? (
        <Error />
      ) : inquiries.length === 0 ? (
        <p className="py-16 text-center text-primary-grey">{t("no-inquiries")}</p>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <InquiryCard key={inq.id} inquiry={inq} t={t} />
          ))}
        </div>
      )}
    </div>
  );
};

export default InquiriesPage;
