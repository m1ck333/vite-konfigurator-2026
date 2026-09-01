import React from "react";
import { useTranslation } from "react-i18next";

import SectionHeading from "../components/ui/SectionHeading";
import Loading from "../components/ui/Loading";
import Error from "../components/ui/Error";
import { useInquiries, Inquiry } from "../hooks/useInquiries";

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

const InquiryCard: React.FC<{ inquiry: Inquiry; t: (k: string) => string }> = ({ inquiry, t }) => {
  const sections = parseSections(inquiry.config);
  const details: [string, unknown][] = [
    [t("email"), inquiry.email],
    [t("phone"), inquiry.phone],
  ];
  return (
    <div className="rounded-2xl border border-primary-grey-lightest bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 border-b border-primary-grey-lightest pb-3">
        <h3 className="text-base font-semibold text-primary-grey-dark">
          {inquiry.name || t("inquiry")} <span className="text-primary-grey font-normal">#{inquiry.id}</span>
        </h3>
        {inquiry.created_at && (
          <span className="text-xs text-primary-grey">{new Date(inquiry.created_at).toLocaleString()}</span>
        )}
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

      {sections.length > 0 ? (
        <div className="space-y-3">
          {sections.map((s, i) => {
            const entries = Object.entries(s.data || {}).filter(([, v]) => v != null && v !== "");
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
