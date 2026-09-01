import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { faPrint, faTrash, faEye } from "@fortawesome/free-solid-svg-icons";

import SectionHeading from "../components/ui/SectionHeading";
import Loading from "../components/ui/Loading";
import Error from "../components/ui/Error";
import Button from "../components/ui/Button";
import Checkbox from "../components/ui/Checkbox";
import Modal from "../components/ui/Modal";
import Table, { TableColumn } from "../components/ui/Table";
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
const fmtDate = (d?: string | null) => (d ? new Date(d).toLocaleString() : "—");

// Load the two stored door images with the admin token (img tags can't send auth headers),
// exposing them as object URLs. Returns undefined for inquiries that have no stored image.
const useInquiryImages = (id: number) => {
  const token = useSelector(selectUserToken);
  const [outerUrl, setOuterUrl] = useState<string>();
  const [innerUrl, setInnerUrl] = useState<string>();
  useEffect(() => {
    if (!token) return;
    const urls: string[] = [];
    let cancelled = false;
    const load = async (which: "outer" | "inner", set: (u: string) => void) => {
      try {
        const r = await fetch(`${API}/api/admin/inquiries/${id}/image/${which}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!r.ok) return;
        const url = URL.createObjectURL(await r.blob());
        if (cancelled) return URL.revokeObjectURL(url);
        urls.push(url);
        set(url);
      } catch {
        /* no image stored — fine */
      }
    };
    load("outer", setOuterUrl);
    load("inner", setInnerUrl);
    return () => {
      cancelled = true;
      urls.forEach(URL.revokeObjectURL);
    };
  }, [token, id]);
  return { outerUrl, innerUrl };
};

// Printable / viewable sheet: sender + full configuration + door images. Sections use a fixed
// two-column layout so every value column lines up across sections. react-to-print clones this
// (with the page styles) into the print iframe → the browser's "Save as PDF".
const InquirySheet = React.forwardRef<
  HTMLDivElement,
  { inquiry: Inquiry; sections: Section[]; outerUrl?: string; innerUrl?: string; t: (k: string) => string }
>(({ inquiry, sections, outerUrl, innerUrl, t }, ref) => {
  const details: [string, unknown][] = [
    [t("fullName"), inquiry.name],
    [t("email"), inquiry.email],
    [t("phone"), inquiry.phone],
    [t("message"), inquiry.message],
  ].filter(([, v]) => v) as [string, unknown][];
  return (
    <div ref={ref} className="bg-white p-6 text-primary-grey-dark">
      <div className="mb-5 flex items-baseline justify-between border-b-2 border-primary-green pb-2">
        <h1 className="text-xl font-bold text-primary-green">Algreen — {t("inquiry")}</h1>
        <span className="text-sm text-primary-grey">
          #{inquiry.id}
          {inquiry.created_at ? ` · ${fmtDate(inquiry.created_at)}` : ""}
        </span>
      </div>

      <table className="mb-5 w-full table-fixed text-sm">
        <tbody>
          {details.map(([k, v]) => (
            <tr key={k}>
              <td className="w-1/3 py-1 pr-6 align-top text-primary-grey">{k}</td>
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
            <table className="w-full table-fixed text-sm">
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

// Detail modal — view the whole inquiry + print/save it as PDF. Rendered only when open, so the
// print ref is always attached to real DOM (fixes react-to-print "content returned null").
const DetailModal: React.FC<{ inquiry: Inquiry; onClose: () => void; t: (k: string) => string }> = ({
  inquiry,
  onClose,
  t,
}) => {
  const sections = parseSections(inquiry.config);
  const { outerUrl, innerUrl } = useInquiryImages(inquiry.id);
  const printRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `Algreen-upit-${inquiry.id}`,
    pageStyle: "@page { size: A4; margin: 12mm; } @media print { body { -webkit-print-color-adjust: exact; } }",
  });

  return (
    <Modal isOpen onClose={onClose} size="3xl" title={`${t("inquiry")} #${inquiry.id}`}>
      <div className="mb-3 flex justify-end">
        <Button variant="primary-green" size="sm" icon={faPrint} onClick={handlePrint}>
          {t("print-pdf")}
        </Button>
      </div>
      <div className="max-h-[70vh] overflow-auto rounded-lg border border-primary-grey-lightest">
        <InquirySheet
          ref={printRef}
          inquiry={inquiry}
          sections={sections}
          outerUrl={outerUrl}
          innerUrl={innerUrl}
          t={t}
        />
      </div>
    </Modal>
  );
};

const InquiriesPage: React.FC = () => {
  const { t } = useTranslation();
  const { inquiries, isLoading, isError, deleteInquiries } = useInquiries();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [detail, setDetail] = useState<Inquiry | null>(null);
  const [pendingDelete, setPendingDelete] = useState<number[] | null>(null);
  const [deleting, setDeleting] = useState(false);

  const allIds = useMemo(() => inquiries.map((i) => i.id), [inquiries]);
  const allSelected = allIds.length > 0 && selected.size === allIds.length;

  const toggle = (id: number) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(allIds));

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await deleteInquiries(pendingDelete);
      setSelected((prev) => {
        const next = new Set(prev);
        pendingDelete.forEach((id) => next.delete(id));
        return next;
      });
    } finally {
      setDeleting(false);
      setPendingDelete(null);
    }
  };

  const columns: TableColumn[] = [
    {
      header: "",
      accessor: "select",
      sortable: false,
      filterable: false,
      render: (row: Inquiry) => (
        <Checkbox checked={selected.has(row.id)} onChange={() => toggle(row.id)} label="" />
      ),
    },
    { header: "#", accessor: "id", sortable: true, filterable: false },
    {
      header: t("date"),
      accessor: "created_at",
      sortable: true,
      filterable: false,
      render: (row: Inquiry) => fmtDate(row.created_at),
    },
    {
      header: t("fullName"),
      accessor: "name",
      sortable: true,
      filterable: true,
      render: (row: Inquiry) => row.name || "—",
    },
    { header: t("email"), accessor: "email", sortable: true, filterable: true },
    { header: t("phone"), accessor: "phone", sortable: false, filterable: false },
    {
      header: t("actions"),
      accessor: "actions",
      sortable: false,
      filterable: false,
      render: (row: Inquiry) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            variant="icon"
            onClick={() => setDetail(row)}
            className="text-primary-green hover:text-primary-green-dark"
            icon={faEye}
          />
          <Button
            variant="icon"
            onClick={() => setPendingDelete([row.id])}
            className="text-danger hover:text-danger-dark"
            icon={faTrash}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-3 p-4">
        <SectionHeading>{t("inquiries")}</SectionHeading>

        {isLoading ? (
          <Loading variant="primary-light" />
        ) : isError ? (
          <Error />
        ) : inquiries.length === 0 ? (
          <p className="py-16 text-center text-primary-grey">{t("no-inquiries")}</p>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Checkbox checked={allSelected} onChange={toggleAll} label={t("select-all")} />
              {selected.size > 0 && (
                <Button
                  variant="danger"
                  size="sm"
                  icon={faTrash}
                  onClick={() => setPendingDelete(Array.from(selected))}
                >
                  {t("delete-selected")} ({selected.size})
                </Button>
              )}
            </div>

            <Table pagination striped columns={columns} data={inquiries} />
          </>
        )}
      </div>

      {detail && <DetailModal inquiry={detail} onClose={() => setDetail(null)} t={t} />}

      {pendingDelete && (
        <Modal isOpen onClose={() => !deleting && setPendingDelete(null)} size="sm" title={t("delete")}>
          <p className="mb-5 text-sm text-primary-grey-dark">
            {pendingDelete.length === 1
              ? t("confirm-delete-inquiry")
              : `${t("confirm-delete-inquiries")} (${pendingDelete.length})`}
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="link" onClick={() => setPendingDelete(null)} disabled={deleting}>
              {t("cancel")}
            </Button>
            <Button variant="danger" icon={faTrash} onClick={confirmDelete} isLoading={deleting}>
              {t("delete")}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default InquiriesPage;
