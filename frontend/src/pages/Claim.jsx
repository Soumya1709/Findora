import { useState,useEffect } from "react";
import { useParams } from "react-router-dom";
import { updateClaimStatus,getClaimById } from "../services/claimService";

const Logo = ({ className = "" }) => (
  <span className={`font-bold text-xl tracking-tight ${className}`}>
    <span className="text-gray-900">Find</span>
    <span className="text-blue-500">ora</span>
  </span>
);

const BellIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
);

const GearIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="2,6 5,9 10,3" />
  </svg>
);

const XIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CheckCircleIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <circle cx="12" cy="12" r="10" /><path d="M9 12l2 2 4-4" />
  </svg>
);

const LaptopSVG = ({ className = "" }) => (
  <svg viewBox="0 0 560 420" xmlns="http://www.w3.org/2000/svg" className={className}>
    <rect width="560" height="420" fill="#e8ecf0" />
    <rect x="120" y="70" width="320" height="200" rx="10" fill="#c8ccd2" />
    <rect x="130" y="80" width="300" height="180" rx="6" fill="#1e2027" />
    <rect x="80" y="270" width="400" height="18" rx="6" fill="#b5b9c2" />
    <rect x="210" y="274" width="140" height="10" rx="4" fill="#9ca0aa" />
    <circle cx="280" cy="170" r="8" fill="#3a3f4a" />
  </svg>
);

const claimAnswers = [
  {
    q: "Can you unlock the device with the password?",
    a: "Yes — it's a 6-digit passcode set to my birth year combined with my dog's name initials.",
    match: true,
  },
  {
    q: "Describe any specific scratches or markings.",
    a: "There's a small scratch on the bottom-left corner near the hinge, and a faint sticker residue mark on the lid where I used to have a sticker.",
    match: true,
  },
  {
    q: "When and where did you lose it?",
    a: "I left it at the quiet study zone on the 2nd floor of the Main Library on Tuesday afternoon, around 3 PM, after a study session.",
    match: true,
  },
];

export default function ClaimPage() {
  const [decision, setDecision] = useState(null);
  const [showRejectNote, setShowRejectNote] = useState(false);
  const [note, setNote] = useState("");
  const [claim, setClaim] = useState(null);
  const [loading, setLoading] =useState(true);

  const { id } = useParams();

  useEffect(() => {
  fetchClaim();
  }, []);

const fetchClaim = async () => {
  try {
    const res =await getClaimById(id);
    console.log("Claim:", res.data.claim);
    console.log("Item:", res.data.claim.item);

    setClaim(res.data.claim);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};


  const handleUpdate = async (claimId,status) => {
  try {
    await updateClaimStatus(
      claimId,
      status
    );

    setDecision(status);

    alert(
      `Claim ${status} successfully`
    );
  } catch (error) {
    console.error(error);

    alert(
      "Failed to update claim"
    );
  }
};

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  );
}
if (!claim) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Claim not found
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">

      {/* NAV */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 flex items-center gap-6" style={{ height: 52 }}>
          <Logo />
          <div className="flex gap-1 flex-1">
            {["Browse", "Report", "Matching"].map((item, i) => (
              <a
                key={item}
                href="#"
                className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                  i === 2
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="text-gray-400 hover:text-gray-700 transition-colors"><BellIcon /></button>
            <button className="text-gray-400 hover:text-gray-700 transition-colors"><GearIcon /></button>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-bold grid place-items-center cursor-pointer">
              JD
            </div>
          </div>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-1.5 text-xs text-gray-400">
        <a href="#" className="hover:text-blue-500 transition-colors">Home</a>
        <span>›</span>
        <a href="#" className="hover:text-blue-500 transition-colors">Matching</a>
        <span>›</span>
        <span className="text-gray-600">Review Claim</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">

        {/* Decision banner */}
        {decision && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 flex items-center gap-2.5 text-sm font-medium ${
              decision === "approved"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-600"
            }`}
          >
            {decision === "approved" ? <CheckCircleIcon className="w-4 h-4" /> : <XIcon className="w-4 h-4" />}
            {decision === "approved"
              ? "Claim approved. The claimant has been notified to arrange pickup."
              : "Claim rejected. The claimant has been notified."}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

          {/* LEFT */}
          <div>
            {/* Item summary card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 mb-6">
              <div className="w-28 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                   {claim.item.images?.length > 0 ? (
                   <img
                      src={claim.item.images[0]}
                      alt={claim.item.title}
                      className="w-full h-full object-cover"
                    />) : (
                      <LaptopSVG className="w-full h-full" />
                     )}
                   </div>
              <div className="flex-1">
                <div className="flex gap-2 mb-1.5">
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">{claim.item.category}</span>
                  <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-gray-50 text-gray-700 border border-gray-200">#CF-88291</span>
                </div>
                <div className="text-base font-bold tracking-tight">{claim.item.title}</div>
                <div className="text-xs text-gray-400 mt-1">{claim.item.location?.name} · {new Date( claim.item.dateLostOrFound).toLocaleDateString()}</div>
              </div>
            </div>

            <div className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                claim.status === "pending"? "bg-yellow-100 text-yellow-700": claim.status === "approved"? "bg-green-100 text-green-700": "bg-red-100 text-red-700"}`}>
                 {claim.status}
            </div>

            {/* Claimant info */}
            <div className="text-[10.5px] font-bold uppercase tracking-widest text-gray-400 mb-3">
              Claimant Details
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white text-sm font-bold grid place-items-center flex-shrink-0">
                 {claim.claimant.fullName.split(" ").map((n) => n[0]).join("").toUpperCase()}
                </div>
                <div>
                  <div className="text-sm font-semibold">{claim.claimant.fullName}</div>
                  <div className="text-xs text-gray-400">Student ID: 20231147</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3.5 p-4 bg-gray-50 border border-gray-200 rounded-xl">
                <div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Email</div>
                  <div className="text-sm font-semibold">{claim.claimant.email}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Phone</div>
                  <div className="text-sm font-semibold">+91 98765 43210</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Claim Submitted</div>
                  <div className="text-sm font-semibold">{new Date(claim.createdAt).toLocaleDateString()}</div>
                </div>
                <div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Claim ID</div>
                  <div className="text-sm font-semibold text-red-500">{claim._id}</div>
                </div>
              </div>
            </div>

            {/* Verification answers */}
            <div className="text-[10.5px] font-bold uppercase tracking-widest text-gray-400 mb-3">
              Verification Responses
            </div>
            <div className="flex flex-col gap-3">
              {claimAnswers.map((item, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="text-sm font-semibold text-gray-700">{item.q}</div>
                    {item.match && (
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex-shrink-0">
                        <CheckIcon /> Matches
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — decision panel */}
          <div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 sticky top-20">
              <div className="text-[10.5px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                Match Confidence
              </div>
              <div className="flex items-center gap-3 mb-5">
                <div className="text-3xl font-bold text-emerald-600">91%</div>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: "91%" }} />
                </div>
              </div>

              <div className="text-[10.5px] font-bold uppercase tracking-widest text-gray-400 mb-3">
                Decision Checklist
              </div>
              <div className="flex flex-col gap-2 mb-5">
                {[
                  "Description matches found item",
                  "Unlock method confirmed",
                  "Location & time consistent",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckIcon />
                    </div>
                    {item}
                  </div>
                ))}
              </div>

              {!decision ? (
                <>
                  <button
                    onClick={() =>handleUpdate(claim._id,"approved")}
                    className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    Approve Claim
                  </button>

                  <button
                    onClick={() =>handleUpdate(claim._id,"rejected")}
                    className="w-full mt-2.5 py-2.5 border border-red-200 hover:bg-red-50 text-red-500 text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2 bg-white"
                  >
                    <XIcon className="w-4 h-4" />
                    Reject Claim
                  </button>

                  {showRejectNote && (
                    <div className="mt-3">
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add a reason for rejecting (optional)…"
                        rows={3}
                        className="w-full text-sm border border-gray-200 rounded-lg p-2.5 text-gray-700 placeholder-gray-400 focus:outline-none focus:border-blue-400 resize-none"
                      />
                      <button
                        onClick={() => setDecision("rejected")}
                        className="w-full mt-2 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition-colors"
                      >
                        Confirm Rejection
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-2">
                  <div
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                      decision === "approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {decision === "approved" ? <CheckCircleIcon className="w-4 h-4" /> : <XIcon className="w-4 h-4" />}
                    {decision === "approved" ? "Approved" : "Rejected"}
                  </div>
                  <button
                    onClick={() => { setDecision(null); setNote(""); setShowRejectNote(false); }}
                    className="block mx-auto mt-3 text-xs text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    Undo decision
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl mt-5">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white text-sm font-bold grid place-items-center flex-shrink-0">JS</div>
                <div className="flex-1">
                  <div className="text-sm font-semibold">Jane Smith</div>
                  <div className="text-xs text-gray-400">Reviewing as Library Staff</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-gray-200 px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <Logo className="text-base" />
          <p className="text-xs text-gray-400 mt-1">© 2024 Findora Recovery Systems. All rights reserved.</p>
        </div>
        <div className="flex gap-4 text-xs text-gray-400">
          {["Privacy Policy", "Terms of Service", "Security", "Accessibility", "Support"].map((l) => (
            <a key={l} href="#" className="hover:text-blue-500 transition-colors">{l}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}