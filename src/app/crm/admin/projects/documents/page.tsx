"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  FileSignature,
  Plus,
  Search,
  Download,
  Printer,
  X,
  CheckCircle2,
  Calendar,
  IndianRupee,
  Building2,
  User,
  Trash2,
  Eye,
  ExternalLink,
  ShieldCheck,
  Briefcase,
  ChevronRight,
  ArrowRight,
  Clock,
  Sparkles,
  Layers,
  HelpCircle,
  Copy,
  Check,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import {
  ProjectDocument,
  ProjectDocumentType,
  ProjectDocumentStatus,
  DocumentItem,
  ScopeSection,
  TimelinePhase,
  DeliveryPlanDay,
  PricingModule,
  PaymentMilestone,
} from "@/types";
import { clsx } from "clsx";

export default function QuotationsAndAgreementsPage() {
  const { projects, documents, addDocument, updateDocumentStatus, deleteDocument } =
    useAppStore();

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Creation Wizard Modal State
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "scope" | "pricing" | "timeline" | "terms">("general");

  // Form State
  const [selectedType, setSelectedType] = useState<ProjectDocumentType>("Quotation");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [docTitle, setDocTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [slogan, setSlogan] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [clientName, setClientName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [estimatedTimeline, setEstimatedTimeline] = useState("");
  const [quotationRange, setQuotationRange] = useState("");
  const [proposalOverview, setProposalOverview] = useState("");
  const [totalAmount, setTotalAmount] = useState<number>(10000);
  const [preparedBy, setPreparedBy] = useState("TS DEV — Software & Product Development");
  const [authorizedSignatory, setAuthorizedSignatory] = useState("");
  const [notes, setNotes] = useState("");

  // Rich Template Collections
  const [scopeSections, setScopeSections] = useState<ScopeSection[]>([]);
  const [pricingBreakdown, setPricingBreakdown] = useState<PricingModule[]>([]);
  const [deliveryPlanDays, setDeliveryPlanDays] = useState<DeliveryPlanDay[]>([]);
  const [timelinePhases, setTimelinePhases] = useState<TimelinePhase[]>([]);
  const [paymentMilestones, setPaymentMilestones] = useState<PaymentMilestone[]>([]);
  const [deliverablesList, setDeliverablesList] = useState<string[]>([]);
  const [outOfScopeTerms, setOutOfScopeTerms] = useState<string[]>([]);
  const [importantTerms, setImportantTerms] = useState<string[]>([]);
  const [termsAndConditions, setTermsAndConditions] = useState<string[]>([]);

  // Preview Document Modal
  const [previewDoc, setPreviewDoc] = useState<ProjectDocument | null>(null);

  // Quick Preset Handlers
  const loadPreset = (preset: "insurance_quotation" | "matrimony_agreement" | "studio_quotation") => {
    const todayStr = new Date().toISOString().split("T")[0];
    const expiryStr = new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0];

    if (preset === "insurance_quotation") {
      setSelectedType("Quotation");
      setDocNumber("QUO-2026-001");
      setDocTitle("Vehicle Insurance Platform");
      setSubtitle("Deposit & Member Management System — MVP Development Proposal");
      setSlogan("");
      setClientName("Apex Logistics & Services");
      setBusinessName("Vehicle Insurance & Member Portal");
      setClientPhone("+91 76391 30497");
      setClientEmail("contact@apexplatform.in");
      setClientAddress("Coimbatore, Tamil Nadu, India");
      setEffectiveDate(todayStr);
      setValidUntil(expiryStr);
      setEstimatedTimeline("7 Working Days (1 Week)");
      setTotalAmount(10000);
      setQuotationRange("₹8,000 – ₹10,000 (final figure depends on confirmed scope)");
      setPreparedBy("TS DEV — Software & Product Development");
      setAuthorizedSignatory("Apex Logistics Authorized Representative");

      setScopeSections([
        {
          title: "1. PROJECT SCOPE",
          points: [
            "Home Page: Dynamic content section describing the service, process and key information.",
            "User Registration & Login: Account creation and secure login for users.",
            "User Dashboard: User profile, deposit status, slot/group status and referral information.",
            "Deposit Module: Records the user's required deposit and maintains deposit status.",
            "50-Member Slot Logic: Deposited/eligible users are grouped into slots of 50. Slot 1 fills first; on completion the system moves to the next slot.",
            "Eligibility Rule: Registration alone is not counted for slot allocation — only completed deposits are counted.",
            "Referral System: Generates a unique referral link connected to the referring User ID.",
            "Referral Commission: Tracks a 5% commission for the referrer when the referred user completes the required deposit, per approved business rules.",
            "Email Notification: Sends email notifications for defined group/slot process updates.",
            "Reward / Shortlisting: Admin can shortlist one eligible member from a completed 50-member group for the defined 1-gram gold reward, subject to the client's approved rules and legal requirements.",
            "Admin Panel: Manage users, deposits, slots, referrals, commissions, notifications and reward/shortlisting status.",
            "Admin Dashboard: View registered users, deposited users, deposit status/amounts, slot progress, referral activity and commission information.",
            "Backend & Database: API, database and business logic required for the above scope.",
            "Deployment: Basic production deployment and configuration.",
          ],
        },
      ]);

      setPricingBreakdown([
        { serviceDescription: "Frontend / UI Development", price: 2500 },
        { serviceDescription: "Backend / API Development", price: 2000 },
        { serviceDescription: "Database & Business Logic", price: 1500 },
        { serviceDescription: "User Login, Registration & Dashboard", price: 1000 },
        { serviceDescription: "Deposit, Slot & Referral Logic", price: 1000 },
        { serviceDescription: "Admin Panel & Dashboard", price: 1000 },
        { serviceDescription: "Email Integration & Notifications", price: 500 },
        { serviceDescription: "Deployment / Basic Setup", price: 500 },
      ]);

      setDeliveryPlanDays([
        { day: "Day 1", work: "Project setup, database structure, UI foundation, registration & login" },
        { day: "Day 2", work: "Home page and user dashboard" },
        { day: "Day 3", work: "Deposit module and deposit-status logic" },
        { day: "Day 4", work: "50-member slot logic and referral system" },
        { day: "Day 5", work: "Admin panel, dashboard and commission tracking" },
        { day: "Day 6", work: "Email notifications, reward/shortlisting flow and testing" },
        { day: "Day 7", work: "Bug fixing, final testing, deployment and handover" },
      ]);

      setPaymentMilestones([
        { name: "Project Confirmation / Start", amount: 4000, dueWhen: "Project Kickoff" },
        { name: "Core Features Completion", amount: 3000, dueWhen: "Midpoint Review" },
        { name: "Testing & Final Delivery", amount: 3000, dueWhen: "Final Handover" },
      ]);

      setOutOfScopeTerms([
        "Any new feature, page, major UI change, additional workflow, third-party API, payment gateway, SMS/WhatsApp integration, mobile application, advanced reporting or other requirement not listed above will be charged separately.",
        "Additional work will begin only after scope and additional cost are approved by the client.",
        "Domain, hosting/server, payment gateway fees, SMS/email service charges and other third-party subscription or transaction charges are separate unless specifically included in a revised quotation.",
        "The ₹8,000–₹10,000 range applies to the defined MVP scope. The final amount within this range will be fixed after scope confirmation.",
      ]);

      setImportantTerms([
        "The 7-working-day timeline starts after project confirmation, initial payment and receipt of required content/access/details.",
        "The client is responsible for providing final business rules, content and required credentials on time.",
        "The gold reward, eligibility criteria, selection process, taxation, regulatory compliance and legal/business obligations must be finalized and approved by the client before production use.",
        "Basic bug fixing for the agreed scope is included. New features are not included in the quoted development cost.",
      ]);

      setNotes("Thank you for choosing TS DEV. We look forward to building this with you.");
    } else if (preset === "matrimony_agreement") {
      setSelectedType("Service Agreement");
      setDocNumber("TSDEV-MAT-2026-002");
      setDocTitle("Matrimony Website & Mobile App");
      setSubtitle("Service Agreement & Project Proposal");
      setSlogan("Connect • Discover • Trust");
      setClientName("Muthupandi");
      setBusinessName("Matrimony");
      setClientPhone("+91 96779 73113");
      setClientEmail("contact@matrimonyplatform.in");
      setClientAddress("Madurai, Tamil Nadu, India");
      setEffectiveDate(todayStr);
      setValidUntil(expiryStr);
      setEstimatedTimeline("6 – 8 Weeks");
      setTotalAmount(36999);
      setPreparedBy("Tamilselvan R (Authorized Person)");
      setAuthorizedSignatory("Muthupandi (Client)");
      setProposalOverview(
        "TS DEV will provide end-to-end design and development of a Matrimony Website and Mobile App with an administrative management platform. The solution is intended to provide a structured digital environment for user registration, profile management, profile discovery, interests, connections, communication, controlled profile access and administration.\n\nThe proposed platform will support a responsive public website, user-facing matrimonial experience, mobile application journey and admin controls. The project will be delivered according to the approved scope, timeline and commercial value stated in this agreement."
      );

      setScopeSections([
        {
          title: "PUBLIC WEBSITE",
          points: [
            "Home, About, How It Works, Membership/Plans, Success Stories, FAQ and Contact pages.",
            "Login / Register entry point into the matrimonial application.",
            "Responsive, mobile-friendly and conversion-oriented interface.",
          ],
        },
        {
          title: "USER APPLICATION",
          points: [
            "Registration, OTP/email verification, secure login and password recovery.",
            "Profile creation with personal, education, profession, family, lifestyle and partner-preference details.",
            "Profile photo/document upload and profile management.",
            "Search and filters using approved criteria such as age, gender, location, education and profession.",
            "Profile preview with protected details where required.",
            "Shortlist profiles, send/receive interests and manage requests.",
            "Mutual connection workflow and eligible in-platform messaging.",
            "Notifications, membership/account settings and relevant account actions.",
          ],
        },
        {
          title: "MOBILE APPLICATION",
          points: [
            "Android mobile application covering the core matrimonial user journey.",
            "Splash screen, registration/login and OTP verification.",
            "Home dashboard, profile, search, recommended profiles and match details.",
            "Interest, shortlist, chat, notifications and settings screens.",
            "Mobile-first experience aligned with the approved website/user application flow.",
          ],
        },
        {
          title: "ADMIN DASHBOARD",
          points: [
            "Admin login and management dashboard.",
            "User management, profile verification and approval/rejection.",
            "Match and interest management.",
            "Chat/report management and payment-related administration.",
            "Notifications, content management and reports.",
          ],
        },
        {
          title: "BACKEND, DATABASE & INTEGRATION",
          points: [
            "REST API backend supporting website, mobile app and admin dashboard.",
            "Database structure for users, profiles, preferences, matches and messages.",
            "Preference-based matching workflow using approved business rules.",
            "Authentication and secure data handling.",
            "Payment integration for the agreed profile purchase/access workflow.",
            "Production deployment and configuration.",
          ],
        },
      ]);

      setDeliverablesList([
        "Fully functional matrimonial public website.",
        "User matrimonial application with registration, profiles, discovery, interests, connections and messaging.",
        "Android mobile application covering the core matchmaking journey.",
        "Admin dashboard for users, profiles, matches, content and platform management.",
        "Backend API and database integration.",
        "Preference-based matching workflow configured to agreed business rules.",
        "Production deployment and basic project handover.",
      ]);

      setTimelinePhases([
        { phase: "Requirement Analysis & Discovery", timeline: "Week 1" },
        { phase: "UI/UX Design (Website, Web App, Mobile App, Admin)", timeline: "Weeks 2–3" },
        { phase: "Public Website Development", timeline: "Weeks 3–4" },
        { phase: "User Web Application Development", timeline: "Weeks 4–6" },
        { phase: "Backend, Database & Matching Engine", timeline: "Weeks 3–7" },
        { phase: "Android Mobile Application Development", timeline: "Weeks 5–7" },
        { phase: "Admin Dashboard Development", timeline: "Week 7" },
        { phase: "Testing & Security Review", timeline: "Week 8" },
        { phase: "Client Review & Revisions", timeline: "Week 8" },
        { phase: "Deployment & Final Delivery", timeline: "Week 8" },
      ]);

      setPricingBreakdown([
        { serviceDescription: "Public Website + User Web Application", deliverablesIncluded: "Full public site + registration, profiles, search, matching, interests and chat", price: 14000 },
        { serviceDescription: "Mobile Application (Android Only)", deliverablesIncluded: "Android mobile app covering the core matrimonial journey", price: 10000 },
        { serviceDescription: "Admin Dashboard + Backend & Matching", deliverablesIncluded: "Admin panel, API, database and matching workflow", price: 8000 },
        { serviceDescription: "Deployment & Handover", deliverablesIncluded: "Production deployment, configuration, SSL/setup and handover support", price: 4999 },
      ]);

      setPaymentMilestones([
        { name: "Initial Advance Payment (50%)", percentage: 50, amount: 18499.5, dueWhen: "Before project commencement" },
        { name: "Progress Payment (30%)", percentage: 30, amount: 11099.7, dueWhen: "When the project is 80% complete" },
        { name: "Final Payment (20%)", percentage: 20, amount: 7399.8, dueWhen: "Before final delivery and handover" },
      ]);

      setTermsAndConditions([
        "Scope of Service — Only the services and deliverables specifically listed in this agreement are included.",
        "Client Responsibilities — The client must provide accurate content, images, branding materials, access credentials, approvals and required information on time.",
        "Revision Policy — Revisions within the approved scope are included. Major changes or additional revisions may be charged separately.",
        "Third-Party / Platform Costs — Domain, hosting, premium plugins, paid software, SMS/OTP gateways, payment gateway fees, APIs, stock assets and subscriptions are the client's responsibility unless specifically included.",
        "Performance Expectations — Specific outcomes such as user registrations, successful matches, revenue or engagement cannot be guaranteed because they depend on external factors.",
        "Required Access & Permissions — The client must provide necessary access to hosting, domain, app-store accounts, payment gateway, analytics and other required systems.",
        "Project Cancellation — If the client cancels after work has started, amounts already paid may be non-refundable for completed work, time and resources.",
        "Client Delays — Delays in feedback, approvals, content or access may extend the delivery schedule.",
        "Intellectual Property & Ownership — Upon full payment, ownership of the final agreed deliverables will be transferred to the client, subject to third-party licensing terms.",
        "Additional Work — Work outside the approved scope will be treated as additional work and quoted separately before development.",
        "Communication & Approval — Important project communication, approvals and feedback should be provided through email or WhatsApp to maintain a written project record.",
        "Project Completion — The project is considered completed when the agreed deliverables have been delivered and the included review/revision process is completed.",
      ]);

      setNotes("Building a trusted platform for a better tomorrow.");
    } else {
      setSelectedType("Quotation");
      setDocNumber("QUO-2026-043");
      setDocTitle("Dhilip Studio Photography Portfolio");
      setSubtitle("Portfolio & Client Proofing Portal MVP");
      setClientName("Dhilip Studio");
      setBusinessName("Studio & Media");
      setClientPhone("+91 97100 22334");
      setClientEmail("dhilip@dhilipstudio.in");
      setClientAddress("Coimbatore, Tamil Nadu");
      setEffectiveDate(todayStr);
      setValidUntil(expiryStr);
      setEstimatedTimeline("3 Weeks");
      setTotalAmount(45000);
      setQuotationRange("₹40,000 – ₹45,000");

      setPricingBreakdown([
        { serviceDescription: "Portfolio UI/UX & Next.js Website", price: 30000 },
        { serviceDescription: "Client Session Booking & Gallery Engine", price: 15000 },
      ]);

      setPaymentMilestones([
        { name: "Advance Booking & Setup", amount: 25000, dueWhen: "Signing" },
        { name: "Final Handover & Launch", amount: 20000, dueWhen: "Production Deployment" },
      ]);
    }
  };

  const handleOpenWizard = (initialType: ProjectDocumentType) => {
    setSelectedType(initialType);
    loadPreset(initialType === "Quotation" ? "insurance_quotation" : "matrimony_agreement");
    setIsWizardOpen(true);
  };

  const handleCreateDocument = (e: React.FormEvent) => {
    e.preventDefault();

    const newDoc: Omit<ProjectDocument, "id"> = {
      docNumber: docNumber || `${selectedType === "Quotation" ? "QUO" : "TSDEV-MAT"}-2026-${Math.floor(100 + Math.random() * 900)}`,
      type: selectedType,
      title: docTitle || (selectedType === "Quotation" ? "Project Quotation" : "Master Service Agreement"),
      subtitle,
      slogan,
      projectId: selectedProjectId || "prj-general",
      projectName: docTitle || "Software Delivery",
      clientName: clientName || "Corporate Client",
      businessName,
      clientEmail,
      clientPhone,
      clientAddress,
      createdDate: effectiveDate || new Date().toISOString().split("T")[0],
      validUntil: validUntil || new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      effectiveDate: effectiveDate || new Date().toISOString().split("T")[0],
      status: "Accepted",
      currency: "INR",
      subtotal: totalAmount,
      taxPercent: 0,
      taxAmount: 0,
      totalAmount,
      estimatedTimeline,
      quotationRange,
      proposalOverview,
      scopeSections,
      pricingBreakdown,
      deliveryPlanDays,
      timelinePhases,
      paymentMilestones,
      deliverablesList,
      outOfScopeTerms,
      importantTerms,
      termsAndConditions,
      bankDetails: {
        accountName: "TAMILSELVAN R",
        bankName: "SBI",
        accountNumber: "38544784096",
        ifscCode: "SBIN0003689",
        upiId: "tamil01456@oksbi",
      },
      items: pricingBreakdown.map((p, idx) => ({
        id: `item-${idx}`,
        description: p.serviceDescription,
        deliverable: p.deliverablesIncluded || p.serviceDescription,
        quantity: 1,
        rate: p.price,
        amount: p.price,
      })),
      paymentTerms: `Payment Schedule: ${paymentMilestones.map((m) => `${m.name}: ₹${m.amount.toLocaleString("en-IN")}`).join(", ")}`,
      scopeOfWork: docTitle,
      preparedBy: preparedBy || "TS DEV — Software & Product Development",
      authorizedSignatory: authorizedSignatory || clientName,
      notes,
    };

    addDocument(newDoc);

    setIsWizardOpen(false);
  };

  const filteredDocs = documents.filter((doc) => {
    const matchSearch =
      doc.docNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchType = typeFilter === "All" || doc.type === typeFilter;
    const matchStatus = statusFilter === "All" || doc.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Quotations & Agreements</h1>
            <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-[#2563EB] border border-blue-200">
              TS DEV Standard Formats
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Generate formal multi-page Project Quotations & Master Service Agreements matching official company templates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleOpenWizard("Quotation")}
            className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <FileText className="h-4 w-4" />
            <span>Create Quotation</span>
          </button>
          <button
            onClick={() => handleOpenWizard("Service Agreement")}
            className="flex items-center gap-1.5 rounded-xl bg-[#0F172A] px-3.5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <FileSignature className="h-4 w-4" />
            <span>Create Agreement</span>
          </button>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Total Documents</span>
          <div className="text-xl font-bold text-[#0F172A]">{documents.length}</div>
          <span className="text-[11px] text-[#64748B]">Quotations & Contracts</span>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Project Quotations</span>
          <div className="text-xl font-bold text-[#2563EB]">
            {documents.filter((d) => d.type === "Quotation").length}
          </div>
          <span className="text-[11px] text-[#2563EB] font-medium">MVP & Commercial Scopes</span>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Service Agreements</span>
          <div className="text-xl font-bold text-[#16A34A]">
            {documents.filter((d) => d.type === "Service Agreement").length}
          </div>
          <span className="text-[11px] text-[#16A34A] font-medium">Master Legal Contracts</span>
        </div>
        <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5 shadow-2xs space-y-1">
          <span className="text-xs text-[#64748B] font-medium">Total Pipeline Value</span>
          <div className="text-xl font-bold text-[#0F172A]">
            ₹{documents.reduce((sum, d) => sum + d.totalAmount, 0).toLocaleString("en-IN")}
          </div>
          <span className="text-[11px] text-[#64748B]">Active Contract Sum</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#E2E8F0] bg-white p-3 shadow-2xs">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-[#64748B]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search document no, project, or client..."
            className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] pl-9 pr-3 py-1.5 text-xs text-[#0F172A] focus:outline-hidden font-medium"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0F172A]"
          >
            <option value="All">All Document Types</option>
            <option value="Quotation">Quotations</option>
            <option value="Service Agreement">Service Agreements</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs font-medium text-[#0F172A]"
          >
            <option value="All">All Statuses</option>
            <option value="Accepted">Accepted</option>
            <option value="Signed">Signed</option>
            <option value="Sent">Sent</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
              <tr>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Document No</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Type</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Title / Project</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Client</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Total Value (₹)</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Timeline</th>
                <th className="py-3 px-4 font-semibold text-[#64748B]">Status</th>
                <th className="py-3 px-4 font-semibold text-[#64748B] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1F5F9]">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-xs text-[#64748B]">
                    No documents found. Use "Create Quotation" or "Create Agreement" above.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4 font-bold font-mono text-[#2563EB]">
                      <button
                        type="button"
                        onClick={() => setPreviewDoc(doc)}
                        className="hover:underline text-left cursor-pointer"
                      >
                        {doc.docNumber}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={clsx(
                          "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold border",
                          doc.type === "Quotation"
                            ? "bg-blue-50 text-[#2563EB] border-blue-200"
                            : "bg-emerald-50 text-[#16A34A] border-emerald-200"
                        )}
                      >
                        {doc.type === "Quotation" ? (
                          <FileText className="h-3 w-3" />
                        ) : (
                          <FileSignature className="h-3 w-3" />
                        )}
                        <span>{doc.type}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#0F172A]">{doc.title}</div>
                      {doc.subtitle && (
                        <div className="text-[11px] text-[#64748B] truncate max-w-xs">{doc.subtitle}</div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-[#0F172A]">{doc.clientName}</div>
                      {doc.clientPhone && <div className="text-[11px] text-[#64748B]">{doc.clientPhone}</div>}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0F172A]">
                      ₹{doc.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-[#64748B] font-medium">
                      {doc.estimatedTimeline || "7–14 Days"}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={clsx(
                          "inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-semibold border",
                          doc.status === "Signed" || doc.status === "Accepted"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        )}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setPreviewDoc(doc)}
                          className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1 text-[11px] font-semibold text-[#0F172A] hover:bg-[#F8FAFC] shadow-2xs cursor-pointer"
                        >
                          <Eye className="h-3.5 w-3.5 text-[#2563EB]" />
                          <span>View PDF</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setPreviewDoc(doc);
                            setTimeout(() => window.print(), 300);
                          }}
                          className="flex items-center gap-1 rounded-lg bg-blue-50 border border-blue-200 px-2.5 py-1 text-[11px] font-semibold text-[#2563EB] hover:bg-blue-100 cursor-pointer"
                          title="Print / Download PDF"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL: DOCUMENT CREATION WIZARD                                           */}
      {/* ========================================================================= */}
      {isWizardOpen && (
        <div
          onClick={() => setIsWizardOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 backdrop-blur-2xs p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-2xl my-8 space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <div>
                <h3 className="font-bold text-base text-[#0F172A]">
                  Create {selectedType === "Quotation" ? "Project Quotation" : "Master Service Agreement"}
                </h3>
                <p className="text-xs text-[#64748B]">
                  TS DEV Standard multi-section document builder with live PDF generation.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsWizardOpen(false)}
                className="rounded-lg p-1.5 text-[#64748B] hover:bg-[#F8FAFC]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Quick Template Presets */}
            <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-blue-50/60 border border-blue-100">
              <span className="text-[11px] font-bold text-[#2563EB] flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5" />
                Template Presets:
              </span>
              <button
                type="button"
                onClick={() => loadPreset("insurance_quotation")}
                className={clsx(
                  "px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors shadow-2xs",
                  selectedType === "Quotation" && docNumber === "QUO-2026-001"
                    ? "bg-[#2563EB] text-white border-transparent"
                    : "bg-white border-blue-200 text-[#2563EB] hover:bg-blue-50"
                )}
              >
                Quotation: Vehicle Insurance Platform (₹10,000)
              </button>
              <button
                type="button"
                onClick={() => loadPreset("matrimony_agreement")}
                className={clsx(
                  "px-2.5 py-1 rounded-lg border text-xs font-semibold transition-colors shadow-2xs",
                  selectedType === "Service Agreement"
                    ? "bg-[#0F172A] text-white border-transparent"
                    : "bg-white border-slate-300 text-[#0F172A] hover:bg-slate-50"
                )}
              >
                Service Agreement: Matrimony Platform (₹36,999)
              </button>
              <button
                type="button"
                onClick={() => loadPreset("studio_quotation")}
                className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 text-xs font-semibold text-[#2563EB] hover:bg-blue-50 transition-colors shadow-2xs"
              >
                Quotation: Studio Portfolio (₹45,000)
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleCreateDocument} className="space-y-4 text-xs">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleOpenWizard("Quotation")}
                  className={clsx(
                    "flex items-center justify-center gap-2 rounded-xl p-3 border font-bold transition-all",
                    selectedType === "Quotation"
                      ? "border-[#2563EB] bg-blue-50/60 text-[#2563EB] ring-2 ring-blue-100"
                      : "border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]"
                  )}
                >
                  <FileText className="h-4 w-4" />
                  <span>Project Quotation Template</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenWizard("Service Agreement")}
                  className={clsx(
                    "flex items-center justify-center gap-2 rounded-xl p-3 border font-bold transition-all",
                    selectedType === "Service Agreement"
                      ? "border-[#0F172A] bg-slate-100 text-[#0F172A] ring-2 ring-slate-200"
                      : "border-[#E2E8F0] bg-white text-[#64748B] hover:bg-[#F8FAFC]"
                  )}
                >
                  <FileSignature className="h-4 w-4" />
                  <span>Master Service Agreement Template</span>
                </button>
              </div>

              {/* General Document Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Document Number *</label>
                  <input
                    type="text"
                    required
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 font-mono text-xs font-bold text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Project / Document Title *</label>
                  <input
                    type="text"
                    required
                    value={docTitle}
                    onChange={(e) => setDocTitle(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Subtitle / Proposition</label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="e.g. Deposit & Member Management MVP"
                    className="w-full rounded-lg border border-[#E2E8F0] bg-white px-2.5 py-1.5 text-xs text-[#0F172A]"
                  />
                </div>
              </div>

              {/* Client & Commercial Details */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-white border border-[#E2E8F0]">
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Client Phone</label>
                  <input
                    type="text"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Estimated Timeline</label>
                  <input
                    type="text"
                    value={estimatedTimeline}
                    onChange={(e) => setEstimatedTimeline(e.target.value)}
                    placeholder="e.g. 7 Working Days (1 Week)"
                    className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs text-[#0F172A]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#0F172A] block mb-1">Total Project Budget (₹)</label>
                  <input
                    type="number"
                    required
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(Number(e.target.value))}
                    className="w-full rounded-lg border border-[#E2E8F0] px-2.5 py-1.5 text-xs font-bold text-[#2563EB]"
                  />
                </div>
              </div>

              {/* Commercial Modules / Cost Breakdown Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#0F172A]">Module & Commercial Cost Breakdown</label>
                  <button
                    type="button"
                    onClick={() =>
                      setPricingBreakdown([
                        ...pricingBreakdown,
                        { serviceDescription: "Additional Module", price: 2000 },
                      ])
                    }
                    className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Module</span>
                  </button>
                </div>

                <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#0F172A] text-white">
                      <tr>
                        <th className="p-2.5 font-bold uppercase tracking-wider text-[10px]">Module / Service</th>
                        <th className="p-2.5 font-bold uppercase tracking-wider text-[10px]">Deliverables Included</th>
                        <th className="p-2.5 font-bold uppercase tracking-wider text-[10px] w-28 text-right">Amount (₹)</th>
                        <th className="p-2.5 w-10"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1F5F9]">
                      {pricingBreakdown.map((module, idx) => (
                        <tr key={idx}>
                          <td className="p-2">
                            <input
                              type="text"
                              value={module.serviceDescription}
                              onChange={(e) => {
                                const next = [...pricingBreakdown];
                                next[idx].serviceDescription = e.target.value;
                                setPricingBreakdown(next);
                              }}
                              className="w-full rounded border border-[#E2E8F0] px-2 py-1 text-xs font-semibold"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="text"
                              value={module.deliverablesIncluded || ""}
                              onChange={(e) => {
                                const next = [...pricingBreakdown];
                                next[idx].deliverablesIncluded = e.target.value;
                                setPricingBreakdown(next);
                              }}
                              placeholder="e.g. Dynamic Home Page, Registration & Auth"
                              className="w-full rounded border border-[#E2E8F0] px-2 py-1 text-xs text-[#64748B]"
                            />
                          </td>
                          <td className="p-2">
                            <input
                              type="number"
                              value={module.price}
                              onChange={(e) => {
                                const next = [...pricingBreakdown];
                                next[idx].price = Number(e.target.value);
                                setPricingBreakdown(next);
                              }}
                              className="w-full rounded border border-[#E2E8F0] px-2 py-1 text-xs font-bold text-right text-[#0F172A]"
                            />
                          </td>
                          <td className="p-2 text-center">
                            <button
                              type="button"
                              onClick={() => setPricingBreakdown(pricingBreakdown.filter((_, i) => i !== idx))}
                              className="text-[#94A3B8] hover:text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Milestone Payments Table */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#0F172A]">Payment Milestones & Schedule</label>
                  <button
                    type="button"
                    onClick={() =>
                      setPaymentMilestones([
                        ...paymentMilestones,
                        { name: "Progress Milestone", amount: 3000, dueWhen: "Phase Completion" },
                      ])
                    }
                    className="text-xs font-semibold text-[#2563EB] hover:underline flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Milestone</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {paymentMilestones.map((m, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-xs text-[#0F172A]">{m.name}</span>
                        <span className="font-bold text-xs text-[#2563EB]">₹{m.amount.toLocaleString("en-IN")}</span>
                      </div>
                      <div className="text-[11px] text-[#64748B]">Due: {m.dueWhen}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 border-t border-[#E2E8F0] pt-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsWizardOpen(false)}
                  className="rounded-xl border border-[#E2E8F0] px-4 py-2 font-semibold text-[#64748B] hover:bg-[#F8FAFC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 font-semibold text-white hover:bg-blue-700 shadow-xs transition-colors cursor-pointer"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Generate Document & Live PDF</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* FULL PRINTABLE PDF VIEWER MODAL                                           */}
      {/* Renders exact Quotation.pdf or Muthupandi_Matrimony_Service_Agreement.pdf  */}
      {/* ========================================================================= */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-2xs p-4 overflow-y-auto">
          <div className="w-full max-w-4xl rounded-2xl border border-[#E2E8F0] bg-white p-6 sm:p-8 shadow-2xl my-8 space-y-6">
            {/* Modal Controls */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 print:hidden">
              <div className="flex items-center gap-2">
                <span
                  className={clsx(
                    "rounded-md px-2 py-0.5 text-xs font-bold border",
                    previewDoc.type === "Quotation"
                      ? "bg-blue-50 text-[#2563EB] border-blue-200"
                      : "bg-emerald-50 text-[#16A34A] border-emerald-200"
                  )}
                >
                  {previewDoc.type.toUpperCase()}
                </span>
                <span className="font-mono text-xs font-bold text-[#0F172A]">{previewDoc.docNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-xs cursor-pointer"
                >
                  <Printer className="h-4 w-4" />
                  <span>Download / Print PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewDoc(null)}
                  className="rounded-xl border border-[#E2E8F0] p-1.5 text-[#64748B] hover:bg-[#F8FAFC]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* =================================================================== */}
            {/* TEMPLATE A: EXACT PROJECT QUOTATION (Matching Quotation.pdf)         */}
            {/* =================================================================== */}
            {previewDoc.type === "Quotation" ? (
              <div className="border border-slate-200 rounded-xl p-8 sm:p-12 space-y-8 text-[#0F172A] bg-white print:border-none print:p-0 print:shadow-none shadow-xs max-w-3xl mx-auto text-xs leading-relaxed">
                {/* Header with Dark Navy Top Banner */}
                <div className="flex items-center justify-between bg-[#0F172A] text-white p-4 rounded-xl -mx-4 sm:-mx-6 -mt-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#2563EB] font-black text-base text-white">
                      TS
                    </div>
                    <div>
                      <div className="font-black tracking-wider text-sm">TS DEV</div>
                      <div className="text-[10px] text-slate-300">SOFTWARE & PRODUCT DEVELOPMENT</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-extrabold text-sm tracking-widest uppercase">PROJECT QUOTATION</div>
                    <div className="text-[10px] text-slate-300 font-mono">{previewDoc.docNumber}</div>
                  </div>
                </div>

                {/* Title & Executive Spec Box */}
                <div className="space-y-3 pt-2">
                  <div>
                    <h2 className="text-xl font-black text-[#0F172A] tracking-tight">{previewDoc.title}</h2>
                    {previewDoc.subtitle && (
                      <p className="text-xs text-[#64748B] font-medium mt-0.5">{previewDoc.subtitle}</p>
                    )}
                  </div>

                  {/* Spec Table */}
                  <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                    <table className="w-full text-xs">
                      <tbody className="divide-y divide-[#E2E8F0]">
                        <tr>
                          <td className="w-48 bg-[#F8FAFC] py-2 px-3 font-bold text-[#2563EB] uppercase text-[11px]">
                            PROJECT
                          </td>
                          <td className="py-2 px-3 font-semibold text-[#0F172A]">
                            {previewDoc.title} / {previewDoc.businessName || "Custom Platform"}
                          </td>
                        </tr>
                        <tr>
                          <td className="bg-[#F8FAFC] py-2 px-3 font-bold text-[#2563EB] uppercase text-[11px]">
                            DEVELOPMENT TIMELINE
                          </td>
                          <td className="py-2 px-3 font-medium text-[#0F172A]">
                            {previewDoc.estimatedTimeline || "7 Working Days (1 Week)"}
                          </td>
                        </tr>
                        <tr>
                          <td className="bg-[#F8FAFC] py-2 px-3 font-bold text-[#2563EB] uppercase text-[11px]">
                            TOTAL DEVELOPMENT BUDGET
                          </td>
                          <td className="py-2 px-3 font-black text-sm text-[#0F172A]">
                            ₹{previewDoc.totalAmount.toLocaleString("en-IN")}
                          </td>
                        </tr>
                        {previewDoc.quotationRange && (
                          <tr>
                            <td className="bg-[#F8FAFC] py-2 px-3 font-bold text-[#2563EB] uppercase text-[11px]">
                              QUOTATION RANGE
                            </td>
                            <td className="py-2 px-3 font-medium text-[#64748B]">
                              {previewDoc.quotationRange}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 1: PROJECT SCOPE */}
                <div className="space-y-2">
                  <div className="bg-[#0F172A] text-white px-3 py-1.5 rounded font-bold uppercase tracking-wider text-[11px]">
                    1. PROJECT SCOPE
                  </div>
                  <div className="space-y-1.5 text-xs text-[#334155] pt-1 pl-1">
                    {previewDoc.scopeSections && previewDoc.scopeSections.length > 0 ? (
                      previewDoc.scopeSections[0].points.map((pt, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-[#2563EB] font-bold">•</span>
                          <span>{pt}</span>
                        </div>
                      ))
                    ) : (
                      <p>{previewDoc.scopeOfWork}</p>
                    )}
                  </div>
                </div>

                {/* Section 2: DEVELOPMENT COST BREAKDOWN */}
                <div className="space-y-2">
                  <div className="bg-[#0F172A] text-white px-3 py-1.5 rounded font-bold uppercase tracking-wider text-[11px]">
                    2. DEVELOPMENT COST BREAKDOWN
                  </div>
                  <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0F172A] text-white">
                        <tr>
                          <th className="py-2 px-3 font-bold uppercase text-[10px]">Module</th>
                          <th className="py-2 px-3 font-bold uppercase text-[10px] text-right w-32">Amount</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0]">
                        {previewDoc.pricingBreakdown && previewDoc.pricingBreakdown.length > 0 ? (
                          previewDoc.pricingBreakdown.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="py-2 px-3 font-semibold text-[#0F172A]">{item.serviceDescription}</td>
                              <td className="py-2 px-3 text-right font-medium text-[#334155]">
                                ₹{item.price.toLocaleString("en-IN")}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td className="py-2 px-3 font-semibold text-[#0F172A]">Core Full-Stack Development</td>
                            <td className="py-2 px-3 text-right font-medium text-[#334155]">
                              ₹{previewDoc.totalAmount.toLocaleString("en-IN")}
                            </td>
                          </tr>
                        )}
                        <tr className="bg-[#2563EB] text-white font-bold">
                          <td className="py-2 px-3 uppercase tracking-wider">TOTAL</td>
                          <td className="py-2 px-3 text-right text-sm">
                            ₹{previewDoc.totalAmount.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 3: DELIVERY PLAN */}
                {previewDoc.deliveryPlanDays && previewDoc.deliveryPlanDays.length > 0 && (
                  <div className="space-y-2">
                    <div className="bg-[#0F172A] text-white px-3 py-1.5 rounded font-bold uppercase tracking-wider text-[11px]">
                      3. DELIVERY PLAN
                    </div>
                    <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#0F172A] text-white">
                          <tr>
                            <th className="py-2 px-3 font-bold uppercase text-[10px] w-24">Day</th>
                            <th className="py-2 px-3 font-bold uppercase text-[10px]">Work Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0]">
                          {previewDoc.deliveryPlanDays.map((d, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="py-2 px-3 font-bold text-[#2563EB]">{d.day}</td>
                              <td className="py-2 px-3 text-[#334155]">{d.work}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Section 4: PAYMENT TERMS */}
                {previewDoc.paymentMilestones && previewDoc.paymentMilestones.length > 0 && (
                  <div className="space-y-2">
                    <div className="bg-[#0F172A] text-white px-3 py-1.5 rounded font-bold uppercase tracking-wider text-[11px]">
                      4. PAYMENT TERMS
                    </div>
                    <div className="border border-[#E2E8F0] rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#0F172A] text-white">
                          <tr>
                            <th className="py-2 px-3 font-bold uppercase text-[10px]">Milestone</th>
                            <th className="py-2 px-3 font-bold uppercase text-[10px] text-right w-32">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0]">
                          {previewDoc.paymentMilestones.map((m, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="py-2 px-3 font-semibold text-[#0F172A]">{m.name}</td>
                              <td className="py-2 px-3 text-right font-medium text-[#334155]">
                                ₹{m.amount.toLocaleString("en-IN")}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-[#2563EB] text-white font-bold">
                            <td className="py-2 px-3 uppercase tracking-wider">TOTAL</td>
                            <td className="py-2 px-3 text-right text-sm">
                              ₹{previewDoc.totalAmount.toLocaleString("en-IN")}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Section 5: EXTRA FEATURES / OUT OF SCOPE */}
                {previewDoc.outOfScopeTerms && previewDoc.outOfScopeTerms.length > 0 && (
                  <div className="space-y-2">
                    <div className="bg-[#0F172A] text-white px-3 py-1.5 rounded font-bold uppercase tracking-wider text-[11px]">
                      5. EXTRA FEATURES / OUT OF SCOPE
                    </div>
                    <div className="space-y-1.5 text-xs text-[#475569] pl-1">
                      {previewDoc.outOfScopeTerms.map((term, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-[#64748B]">•</span>
                          <span>{term}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 6: IMPORTANT TERMS */}
                {previewDoc.importantTerms && previewDoc.importantTerms.length > 0 && (
                  <div className="space-y-2">
                    <div className="bg-[#0F172A] text-white px-3 py-1.5 rounded font-bold uppercase tracking-wider text-[11px]">
                      6. IMPORTANT TERMS
                    </div>
                    <div className="space-y-1.5 text-xs text-[#475569] pl-1">
                      {previewDoc.importantTerms.map((term, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-[#64748B]">•</span>
                          <span>{term}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Signoff Footer */}
                <div className="pt-6 border-t border-[#E2E8F0] flex items-end justify-between text-xs">
                  <div>
                    <span className="text-[#64748B] block text-[11px]">Prepared By</span>
                    <span className="font-bold text-[#0F172A]">{previewDoc.preparedBy}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#2563EB] block">Thank you for choosing TS DEV.</span>
                    <span className="text-[#64748B] text-[11px]">We look forward to building this with you.</span>
                  </div>
                </div>

                {/* Running Footer Bar */}
                <div className="pt-6 border-t border-[#E2E8F0] flex justify-between items-center text-[10px] text-[#94A3B8] font-medium">
                  <span>TS DEV</span>
                  <span>9944287852 | ceittamilselvanr26@gmail.com | tamilselvandev.in</span>
                  <span>Page 1 of 1</span>
                </div>
              </div>
            ) : (
              /* =================================================================== */
              /* TEMPLATE B: EXACT SERVICE AGREEMENT & PROJECT PROPOSAL              */
              /* Matching Muthupandi_Matrimony_Service_Agreement.pdf                 */
              /* =================================================================== */
              <div className="border border-slate-200 rounded-xl p-8 sm:p-12 space-y-9 text-[#0F172A] bg-white print:border-none print:p-0 print:shadow-none shadow-xs max-w-3xl mx-auto text-xs leading-relaxed">
                {/* Document Top Bar */}
                <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-3 text-[10px] font-bold uppercase tracking-wider text-[#64748B]">
                  <span>TS DEV • SOFTWARE & PRODUCT DEVELOPMENT</span>
                  <span>SERVICE AGREEMENT & PROJECT PROPOSAL</span>
                </div>

                {/* Title & Slogan Hero */}
                <div className="space-y-3">
                  <div>
                    <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">{previewDoc.title}</h1>
                    {previewDoc.slogan && (
                      <div className="text-sm font-bold text-[#2563EB] tracking-wide mt-1">
                        {previewDoc.slogan}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    A modern digital engineering solution designed for trusted user experience, responsive interface,
                    secure administrative management, and production reliability.
                  </p>

                  {/* Project Information Table */}
                  <div className="border border-[#0F172A] rounded-xl overflow-hidden mt-3">
                    <table className="w-full text-xs">
                      <thead className="bg-[#0F172A] text-white">
                        <tr>
                          <th className="py-2 px-3 font-bold uppercase tracking-wider text-[10px] w-48">
                            PROJECT INFORMATION
                          </th>
                          <th className="py-2 px-3 font-bold uppercase tracking-wider text-[10px]">
                            DETAILS
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0]">
                        <tr>
                          <td className="py-2 px-3 font-semibold text-[#475569]">Client</td>
                          <td className="py-2 px-3 font-bold text-[#0F172A]">{previewDoc.clientName}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-semibold text-[#475569]">Business</td>
                          <td className="py-2 px-3 font-semibold text-[#0F172A]">
                            {previewDoc.businessName || "Commercial Software"}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-semibold text-[#475569]">Phone</td>
                          <td className="py-2 px-3 text-[#0F172A]">{previewDoc.clientPhone || "+91 96779 73113"}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-semibold text-[#475569]">Project</td>
                          <td className="py-2 px-3 font-semibold text-[#0F172A]">{previewDoc.title}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-semibold text-[#475569]">Agreement Date</td>
                          <td className="py-2 px-3 text-[#0F172A]">{previewDoc.effectiveDate}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-semibold text-[#475569]">Agreement No.</td>
                          <td className="py-2 px-3 font-mono font-bold text-[#2563EB]">{previewDoc.docNumber}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-semibold text-[#475569]">Estimated Timeline</td>
                          <td className="py-2 px-3 font-medium text-[#0F172A]">{previewDoc.estimatedTimeline || "6 – 8 Weeks"}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-semibold text-[#475569]">Total Project Value</td>
                          <td className="py-2 px-3 font-black text-sm text-[#0F172A]">
                            ₹{previewDoc.totalAmount.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="text-center py-2 text-xs italic font-semibold text-[#64748B]">
                    “Building a trusted platform for a better tomorrow.”
                  </div>
                </div>

                {/* Section 1 & 2: COMPANY & CLIENT DETAILS */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F172A] mb-2">
                      1. COMPANY DETAILS
                    </h3>
                    <div className="border border-[#0F172A] rounded-lg overflow-hidden">
                      <table className="w-full text-xs">
                        <tbody className="divide-y divide-[#E2E8F0]">
                          <tr>
                            <td className="w-48 bg-[#F8FAFC] py-2 px-3 font-semibold text-[#64748B]">Company Name</td>
                            <td className="py-2 px-3 font-bold text-[#0F172A]">TS DEV (Software & Product Development)</td>
                          </tr>
                          <tr>
                            <td className="bg-[#F8FAFC] py-2 px-3 font-semibold text-[#64748B]">Phone Number</td>
                            <td className="py-2 px-3 text-[#0F172A]">9944287852</td>
                          </tr>
                          <tr>
                            <td className="bg-[#F8FAFC] py-2 px-3 font-semibold text-[#64748B]">Email Address</td>
                            <td className="py-2 px-3 text-[#2563EB]">ceittamilselvanr26@gmail.com</td>
                          </tr>
                          <tr>
                            <td className="bg-[#F8FAFC] py-2 px-3 font-semibold text-[#64748B]">Website</td>
                            <td className="py-2 px-3 text-[#0F172A]">tamilselvandev.in</td>
                          </tr>
                          <tr>
                            <td className="bg-[#F8FAFC] py-2 px-3 font-semibold text-[#64748B]">Authorized Person</td>
                            <td className="py-2 px-3 font-bold text-[#0F172A]">Tamilselvan R</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F172A] mb-2">
                      2. CLIENT DETAILS
                    </h3>
                    <div className="border border-[#0F172A] rounded-lg overflow-hidden">
                      <table className="w-full text-xs">
                        <tbody className="divide-y divide-[#E2E8F0]">
                          <tr>
                            <td className="w-48 bg-[#F8FAFC] py-2 px-3 font-semibold text-[#64748B]">Client Name</td>
                            <td className="py-2 px-3 font-bold text-[#0F172A]">{previewDoc.clientName}</td>
                          </tr>
                          <tr>
                            <td className="bg-[#F8FAFC] py-2 px-3 font-semibold text-[#64748B]">Business Name</td>
                            <td className="py-2 px-3 font-semibold text-[#0F172A]">
                              {previewDoc.businessName || "Commercial Client"}
                            </td>
                          </tr>
                          <tr>
                            <td className="bg-[#F8FAFC] py-2 px-3 font-semibold text-[#64748B]">Contact Number</td>
                            <td className="py-2 px-3 text-[#0F172A]">{previewDoc.clientPhone || "+91 96779 73113"}</td>
                          </tr>
                          <tr>
                            <td className="bg-[#F8FAFC] py-2 px-3 font-semibold text-[#64748B]">Email Address</td>
                            <td className="py-2 px-3 text-[#0F172A]">{previewDoc.clientEmail || "contact@client.com"}</td>
                          </tr>
                          <tr>
                            <td className="bg-[#F8FAFC] py-2 px-3 font-semibold text-[#64748B]">Project</td>
                            <td className="py-2 px-3 font-semibold text-[#0F172A]">{previewDoc.title}</td>
                          </tr>
                          <tr>
                            <td className="bg-[#F8FAFC] py-2 px-3 font-semibold text-[#64748B]">Date</td>
                            <td className="py-2 px-3 text-[#0F172A]">{previewDoc.effectiveDate}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Section 3: PROPOSAL OVERVIEW */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                    3. PROPOSAL OVERVIEW
                  </h3>
                  <div className="text-xs text-[#334155] leading-relaxed whitespace-pre-line bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                    {previewDoc.proposalOverview ||
                      "TS DEV will provide end-to-end design and development of the platform with an administrative management platform. The solution is intended to provide a structured digital environment for user registration, core modules, communication, and administration."}
                  </div>
                </div>

                {/* Section 4: SCOPE OF WORK */}
                {previewDoc.scopeSections && previewDoc.scopeSections.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                      4. SCOPE OF WORK
                    </h3>
                    <div className="space-y-4">
                      {previewDoc.scopeSections.map((sec, idx) => (
                        <div key={idx} className="space-y-2">
                          <div className="bg-[#0F172A] text-white px-3 py-1.5 rounded font-bold uppercase tracking-wider text-[11px]">
                            {sec.title}
                          </div>
                          <div className="space-y-1 text-xs text-[#334155] pl-2">
                            {sec.points.map((pt, pIdx) => (
                              <div key={pIdx} className="flex items-start gap-2">
                                <span className="text-[#2563EB] font-bold">•</span>
                                <span>{pt}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 5: DELIVERABLES */}
                {previewDoc.deliverablesList && previewDoc.deliverablesList.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                      5. DELIVERABLES
                    </h3>
                    <div className="space-y-1.5 text-xs text-[#334155] pl-2">
                      {previewDoc.deliverablesList.map((deliv, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-[#16A34A] font-bold">•</span>
                          <span>{deliv}</span>
                        </div>
                      ))}
                      <p className="text-[11px] text-[#64748B] italic pt-1">
                        Any item not specifically mentioned in this section will be considered outside the agreed scope.
                      </p>
                    </div>
                  </div>
                )}

                {/* Section 6: PROJECT TIMELINE */}
                {previewDoc.timelinePhases && previewDoc.timelinePhases.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                      6. PROJECT TIMELINE
                    </h3>
                    <div className="border border-[#0F172A] rounded-xl overflow-hidden">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-[#0F172A] text-white">
                          <tr>
                            <th className="py-2 px-3 font-bold uppercase text-[10px]">PHASE</th>
                            <th className="py-2 px-3 font-bold uppercase text-[10px] text-right w-40">TIMELINE</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0]">
                          {previewDoc.timelinePhases.map((phase, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="py-2 px-3 font-semibold text-[#0F172A]">{phase.phase}</td>
                              <td className="py-2 px-3 text-right font-medium text-[#334155]">{phase.timeline}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Section 7: PROJECT PRICING */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                    7. PROJECT PRICING
                  </h3>
                  <div className="border border-[#0F172A] rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#0F172A] text-white">
                        <tr>
                          <th className="py-2 px-3 font-bold uppercase text-[10px]">SERVICE DESCRIPTION</th>
                          <th className="py-2 px-3 font-bold uppercase text-[10px]">DELIVERABLES INCLUDED</th>
                          <th className="py-2 px-3 font-bold uppercase text-[10px] text-right w-32">PRICE (₹)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0]">
                        {previewDoc.pricingBreakdown && previewDoc.pricingBreakdown.length > 0 ? (
                          previewDoc.pricingBreakdown.map((item, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50">
                              <td className="py-2.5 px-3 font-bold text-[#0F172A]">{item.serviceDescription}</td>
                              <td className="py-2.5 px-3 text-[#475569]">{item.deliverablesIncluded || item.serviceDescription}</td>
                              <td className="py-2.5 px-3 text-right font-medium text-[#334155]">
                                ₹{item.price.toLocaleString("en-IN")}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td className="py-2 px-3 font-semibold text-[#0F172A]">Full-Stack Platform Delivery</td>
                            <td className="py-2 px-3 text-[#64748B]">Complete software development & deployment</td>
                            <td className="py-2 px-3 text-right font-medium text-[#334155]">
                              ₹{previewDoc.totalAmount.toLocaleString("en-IN")}
                            </td>
                          </tr>
                        )}
                        <tr className="bg-[#0F172A] text-white font-bold">
                          <td colSpan={2} className="py-2.5 px-3 uppercase tracking-wider">
                            TOTAL PROJECT COST
                          </td>
                          <td className="py-2.5 px-3 text-right text-sm">
                            ₹{previewDoc.totalAmount.toLocaleString("en-IN")}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 8: PAYMENT STRUCTURE */}
                {previewDoc.paymentMilestones && previewDoc.paymentMilestones.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                      8. PAYMENT STRUCTURE
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {previewDoc.paymentMilestones.map((m, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-[#0F172A] bg-[#F8FAFC] space-y-1">
                          <div className="font-bold text-xs text-[#0F172A]">{m.name}</div>
                          {m.percentage && <div className="text-[11px] text-[#64748B]">Percentage: {m.percentage}%</div>}
                          <div className="font-black text-sm text-[#2563EB]">₹{m.amount.toLocaleString("en-IN")}</div>
                          <div className="text-[10px] text-[#64748B] pt-0.5">Due: {m.dueWhen}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 9: TERMS & CONDITIONS */}
                {previewDoc.termsAndConditions && previewDoc.termsAndConditions.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                      9. TERMS & CONDITIONS
                    </h3>
                    <div className="space-y-1.5 text-xs text-[#334155] pl-2">
                      {previewDoc.termsAndConditions.map((term, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-[#64748B] font-bold">•</span>
                          <span>{term}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section 10: ACCEPTANCE */}
                <div className="space-y-1 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                    10. ACCEPTANCE
                  </h3>
                  <p className="text-xs text-[#475569] leading-relaxed">
                    By accepting this agreement, the client confirms that they have reviewed and agreed to the Scope
                    of Work, Deliverables, Project Pricing, Timeline and Terms & Conditions stated above. We look
                    forward to working with you and delivering the agreed {previewDoc.title}.
                  </p>
                </div>

                {/* Section 11: SIGNATURE & APPROVAL */}
                <div className="space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                    11. SIGNATURE & APPROVAL
                  </h3>
                  <div className="border border-[#0F172A] rounded-xl overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-[#0F172A] text-white">
                        <tr>
                          <th className="py-2 px-3 font-bold uppercase text-[10px] w-1/2 border-r border-slate-700">
                            SERVICE PROVIDER
                          </th>
                          <th className="py-2 px-3 font-bold uppercase text-[10px] w-1/2">
                            CLIENT
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0]">
                        <tr>
                          <td className="p-3 border-r border-[#E2E8F0] space-y-2">
                            <div><span className="text-[#64748B]">Company Name:</span> <span className="font-bold text-[#0F172A]">TS DEV</span></div>
                            <div><span className="text-[#64748B]">Authorized Person:</span> <span className="font-semibold text-[#0F172A]">Tamilselvan R</span></div>
                            <div className="pt-6"><span className="text-[#64748B]">Signature: </span> <span className="border-b border-slate-400 inline-block w-48"></span></div>
                            <div><span className="text-[#64748B]">Date: </span> <span className="border-b border-slate-400 inline-block w-48">{previewDoc.effectiveDate}</span></div>
                          </td>
                          <td className="p-3 space-y-2">
                            <div><span className="text-[#64748B]">Client Name:</span> <span className="font-bold text-[#0F172A]">{previewDoc.clientName}</span></div>
                            <div><span className="text-[#64748B]">Business Name:</span> <span className="font-semibold text-[#0F172A]">{previewDoc.businessName || "Client Business"}</span></div>
                            <div className="pt-6"><span className="text-[#64748B]">Signature: </span> <span className="border-b border-slate-400 inline-block w-48"></span></div>
                            <div><span className="text-[#64748B]">Date: </span> <span className="border-b border-slate-400 inline-block w-48">{previewDoc.effectiveDate}</span></div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Section 12: PAYMENT DETAILS / BANK ACCOUNT */}
                <div className="space-y-2">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-[#0F172A]">
                    12. Payment Details
                  </h3>
                  <div className="border border-[#0F172A] rounded-xl overflow-hidden">
                    <table className="w-full text-xs">
                      <thead className="bg-[#0F172A] text-white">
                        <tr>
                          <th className="py-2 px-3 font-bold uppercase text-[10px] w-48">FIELD</th>
                          <th className="py-2 px-3 font-bold uppercase text-[10px]">DETAILS</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0]">
                        <tr>
                          <td className="py-2 px-3 font-semibold text-[#64748B]">Account Name</td>
                          <td className="py-2 px-3 font-bold text-[#0F172A]">TAMILSELVAN R</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-semibold text-[#64748B]">Bank Name</td>
                          <td className="py-2 px-3 font-bold text-[#0F172A]">SBI</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-semibold text-[#64748B]">Account Number</td>
                          <td className="py-2 px-3 font-mono font-bold text-[#0F172A]">38544784096</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-semibold text-[#64748B]">IFSC Code</td>
                          <td className="py-2 px-3 font-mono font-bold text-[#0F172A]">SBIN0003689</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-3 font-semibold text-[#64748B]">UPI ID</td>
                          <td className="py-2 px-3 font-mono font-bold text-[#2563EB]">tamil01456@oksbi</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Running Footer Bar */}
                <div className="pt-6 border-t border-[#E2E8F0] flex justify-between items-center text-[10px] text-[#94A3B8] font-medium">
                  <span>CONFIDENTIAL • TS DEV</span>
                  <span>TS DEV • SOFTWARE & PRODUCT DEVELOPMENT</span>
                  <span>PAGE 1 OF 1</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
