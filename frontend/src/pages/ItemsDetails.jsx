import { useState,useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getItemById,getSimilarItems} from "../services/itemService";
import { createClaim,checkCanViewOwner } from "../services/claimService";

const Logo = ({ className = "" }) => (
  <span className={`font-bold text-xl tracking-tight ${className}`}>
    <span className="text-gray-900">Find</span>
    <span className="text-blue-500">ora</span>
  </span>
);

const CheckIcon = () => (
  <svg className="w-3 h-3 text-emerald-600" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="2,6 5,9 10,3" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </svg>
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

// SVG placeholders
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

const KeyboardSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="100" height="100" fill="#dde1e8" />
    <rect x="10" y="20" width="80" height="50" rx="4" fill="#b0b5bf" />
    <rect x="14" y="24" width="72" height="42" rx="2" fill="#2a2d35" />
    <rect x="5" y="70" width="90" height="7" rx="3" fill="#a8acb6" />
  </svg>
);

const AppleSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="100" height="100" fill="#e2e6ec" />
    <circle cx="50" cy="46" r="22" fill="#c5c9d0" />
    <circle cx="50" cy="46" r="16" fill="#9ea3ad" />
    <circle cx="50" cy="46" r="6" fill="#d1d5de" />
  </svg>
);

const MapSVG = () => (
  <svg viewBox="0 0 600 160" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
    <rect width="600" height="160" fill="#e8ecf3" />
    <line x1="0" y1="40" x2="600" y2="40" stroke="#d4d8e2" strokeWidth="1" />
    <line x1="0" y1="80" x2="600" y2="80" stroke="#d4d8e2" strokeWidth="1" />
    <line x1="0" y1="120" x2="600" y2="120" stroke="#d4d8e2" strokeWidth="1" />
    <line x1="100" y1="0" x2="100" y2="160" stroke="#d4d8e2" strokeWidth="1" />
    <line x1="200" y1="0" x2="200" y2="160" stroke="#d4d8e2" strokeWidth="1" />
    <line x1="300" y1="0" x2="300" y2="160" stroke="#d4d8e2" strokeWidth="1" />
    <line x1="400" y1="0" x2="400" y2="160" stroke="#d4d8e2" strokeWidth="1" />
    <line x1="500" y1="0" x2="500" y2="160" stroke="#d4d8e2" strokeWidth="1" />
    <rect x="30" y="20" width="55" height="40" rx="3" fill="#cdd2dc" />
    <rect x="120" y="10" width="60" height="55" rx="3" fill="#c8cdd8" />
    <rect x="220" y="30" width="45" height="35" rx="3" fill="#d2d6e0" />
    <rect x="330" y="15" width="70" height="50" rx="3" fill="#c5cad5" />
    <rect x="440" y="25" width="50" height="40" rx="3" fill="#cbd0da" />
    <rect x="50" y="90" width="65" height="45" rx="3" fill="#cdd2dc" />
    <rect x="160" y="85" width="80" height="55" rx="3" fill="#c9cdd8" />
    <rect x="290" y="90" width="55" height="50" rx="3" fill="#d0d4de" />
    <rect x="390" y="80" width="75" height="60" rx="3" fill="#c6cbd6" />
    <rect x="500" y="88" width="60" height="52" rx="3" fill="#cccfd8" />
    <rect x="0" y="68" width="600" height="14" fill="#dce0ea" />
    <rect x="270" y="0" width="20" height="160" fill="#dce0ea" />
    <circle cx="300" cy="75" r="12" fill="#3b82f6" opacity="0.2" />
    <circle cx="300" cy="75" r="7" fill="#3b82f6" />
    <circle cx="300" cy="75" r="3" fill="white" />
  </svg>
);

const similarItems = [
  {
    label: "MacBook Air",
    name: "MacBook Air M1",
    loc: "Found in Student Union",
    match: 92,
    time: "2 days ago",
    svg: (
      <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="200" height="150" fill="#e4e8ef" />
        <rect x="40" y="25" width="120" height="75" rx="5" fill="#b5bac4" />
        <rect x="46" y="31" width="108" height="63" rx="3" fill="#1e2127" />
        <circle cx="100" cy="62" r="5" fill="#3a3f4a" />
        <rect x="28" y="100" width="144" height="10" rx="4" fill="#adb1bb" />
      </svg>
    ),
  },
  {
    label: "Accessories",
    name: "Sony Headphones",
    loc: "Found in Science Hall",
    match: 85,
    time: "Yesterday",
    svg: (
      <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="200" height="150" fill="#2a2a2a" />
        <ellipse cx="100" cy="60" rx="42" ry="42" fill="#1a1a1a" />
        <ellipse cx="100" cy="60" rx="35" ry="35" fill="#111" />
        <rect x="85" y="95" width="30" height="30" rx="3" fill="#333" />
      </svg>
    ),
  },
  {
    label: "Accessories",
    name: "Laptop Sleeve – Grey",
    loc: "Found in Quad Area",
    match: 78,
    time: "4 hours ago",
    svg: (
      <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <rect width="200" height="150" fill="#d0d4dc" />
        <rect x="35" y="30" width="130" height="90" rx="6" fill="#b8bcc7" />
        <rect x="42" y="37" width="116" height="76" rx="4" fill="#c8cdd8" />
        <line x1="42" y1="55" x2="158" y2="55" stroke="#b0b5bf" strokeWidth="1" />
        <line x1="42" y1="73" x2="158" y2="73" stroke="#b0b5bf" strokeWidth="1" />
        <line x1="42" y1="91" x2="158" y2="91" stroke="#b0b5bf" strokeWidth="1" />
      </svg>
    ),
  },
];

export default function ItemsDetails() {
  const { id } = useParams();
  const [activeThumb, setActiveThumb] = useState(0);
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarItems, setSimilarItems] = useState([]);
  const [showOwnerModal,setShowOwnerModal] = useState(false);
  const [canViewOwner,setCanViewOwner] = useState(false);
  const navigate=useNavigate();
  
  useEffect(() => {
  fetchItem();
}, [id]);

  useEffect(() => {
  const fetchPermission =
    async () => {
      try {
        const res =
          await checkCanViewOwner(
            id
          );

        setCanViewOwner(
          res.data.canViewOwner
        );
      } catch (error) {
        console.error(error);
      }
    };

  fetchPermission();
}, [id]);

const fetchItem = async () => {
  try {
    console.log("Fetching ID:", id);
    const res = await getItemById(id);
    console.log("Response:", res.data);
    setItem(res.data.item);
    const similarRes = await getSimilarItems(id);

    console.log("Similar:", similarRes.data);

    setSimilarItems(similarRes.data.items);
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};
if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      Loading...
    </div>
  );
} 

if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Item not found
      </div>
    );
  }
const user = JSON.parse(
  localStorage.getItem("user") || "{}"
);

const initials =
  user?.fullName
    ?.split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "U";

const handleClaim = async () => {
  try {
    const res = await createClaim(
      item._id
    );

    console.log(res.data);
    

    alert(
      "Claim request submitted successfully"
    );
  } catch (error) {
    console.error(error);

    alert(
      error.response?.data?.message ||
      "Failed to create claim"
    );
  }
};
  

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">

      {/* NAV */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-6 h-13 flex items-center gap-6" style={{ height: 52 }}>
          <Logo />
          <div className="flex gap-1 flex-1">
            {["Browse", "Report", "Matching"].map((item, i) => (
              <a
                key={item}
                href="#"
                className={`text-sm font-medium px-3 py-1.5 rounded-md transition-colors ${
                  i === 0
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
             {initials}
            </div>
          </div>
        </div>
      </nav>

      {/* BREADCRUMB */}
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-1.5 text-xs text-gray-400">
        <a href="#" className="hover:text-blue-500 transition-colors">Home</a>
        <span>›</span>
        <a href="#" className="hover:text-blue-500 transition-colors">{item?.category}</a>
        <span>›</span>
        <span className="text-gray-600">{item?.brand}</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8">

          {/* LEFT */}
          <div>
            {/* Main image */}
            <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-[4/3]">
              {item?.images?.length ? (
           <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover"
           />
            ) : (
              <LaptopSVG className="w-full h-full" />
            )}
              <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                <span>✓</span> {item?.type}
              </div>
            </div>

            {/* Thumbnails */}
            <div className="flex gap-2.5 mt-3">
              {[<KeyboardSVG />, <AppleSVG />, null].map((Thumb, i) => (
                <div
                  key={i}
                  onClick={() => setActiveThumb(i)}
                  className={`flex-1 aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer border-2 transition-colors relative ${
                    activeThumb === i ? "border-blue-500" : "border-transparent hover:border-blue-300"
                  }`}
                >
                  {i < 2 ? Thumb : (
                    <>
                      <div className="w-full h-full bg-gray-200" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm font-semibold rounded-md">
                        +2 More
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>

            {/* Map */}
            <div className="mt-4 rounded-xl overflow-hidden border border-gray-200 relative" style={{ height: 160 }}>
              <MapSVG />
              <div className="absolute bottom-2.5 left-2.5 bg-white/90 border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-700 flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                {item?.location?.name}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            {/* Tags */}
            <div className="flex gap-2 flex-wrap mb-3">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-600 border border-blue-200">{item?.category}</span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-gray-50 text-gray-700 border border-gray-200">{item?.brand}</span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight leading-tight mb-2.5">
              {item?.title}
            </h1>

            <p className="text-sm text-gray-500 leading-relaxed mb-5">
              {item?.description}
            </p>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-3.5 p-4 bg-gray-50 border border-gray-200 rounded-xl mb-5">
              {[
  {
    label: "Category",
    val: item?.category,
  },
  {
    label: "Brand",
    val: item?.brand,
  },
  {
    label: "Date",
    val: new Date(
      item?.dateLostOrFound
    ).toLocaleDateString(),
  },
  {
    label: "Reference ID",
    val: item?._id?.slice(-6),
    red: true,
  },
].map(({ label, val, red }) => (
                <div key={label}>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</div>
                  <div className={`text-sm font-semibold ${red ? "text-red-500" : "text-gray-900"}`}>{val}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            {
               item.type === "found" && item.reportedBy?._id !== user.id && (
               <button
                  onClick={handleClaim} className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
               <svg
                  className="w-4 h-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                <circle cx="12" cy="12" r="10" />
                   <path d="M12 8v4l3 3" />
               </svg>

                   Is This Mine?
                </button>
             )}

            <button className="w-full mt-2.5 py-2.5 border border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-700 text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-2 bg-white">
              <ShareIcon />
              Share with Others
            </button>

            {/* Checklist */}
            <div className="mt-5 mb-3 text-[10.5px] font-bold uppercase tracking-widest text-gray-400">
              Verification Checklist
            </div>
            <div className="flex flex-col gap-2">
              {[
                "Must be able to unlock with password",
                "Describe any specific scratches or markings",
                "Valid Student ID required for handover",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5 text-sm text-gray-700">
                  <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckIcon />
                  </div>
                  {item}
                </div>
              ))}
            </div>

            {/* Staff card */}
            <div className="flex items-center justify-between gap-4 p-4 border border-gray-200 rounded-xl mt-5">
              <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white text-sm font-bold grid place-items-center">
                 {item.reportedBy?.fullName
                 ?.split(" ")
                 .map((n) => n[0])
                 .join("")
                 .toUpperCase()}
              </div>

              <div>
                 <h3 className="text-sm font-semibold text-gray-900">
                     Reported By
                 </h3>

                 <p className="text-xs text-gray-500">
                    {item.reportedBy?.fullName}
                 </p>
              </div>
            </div>

              <div className="flex flex-col items-end">
              <button disabled={!canViewOwner} onClick={() => setShowOwnerModal(true)} className={`px-3 py-2 text-xs font-medium rounded-lg ${canViewOwner? "border border-gray-200 hover:border-blue-400 hover:text-blue-600 bg-white": "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
                 Owner Information
              </button>

              {!canViewOwner && ( <p className="text-[10px] text-gray-400 mt-1"> Available after claim approval</p>)}
             </div>
             </div>
            </div>
          </div>

        {/* SIMILAR ITEMS */}
        <div className="mt-10">
          <h2 className="text-base font-bold mb-4 flex items-center gap-2">
            <span className="w-1 h-4 bg-blue-500 rounded inline-block" />
            Similar Found Items
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {similarItems.map((item) => (
              <div
                key={item._id}
                onClick={() => navigate(`/item/${item._id}`)}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="aspect-[4/3] bg-gray-100 relative overflow-hidden">
                  <img
                    src={item.images?.[0] || "https://placehold.co/400x300"}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute top-2 left-2 bg-black/50 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {item.type}
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-sm font-semibold mb-0.5">
                    {item.title}
                  </div>

                  <div className="text-xs text-gray-400 mb-2">
                    {item.location?.name}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-xs font-semibold text-emerald-600">
                      {item.category}
                    </div>

                    <div className="text-xs text-gray-400">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showOwnerModal && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-md flex items-center justify-center z-50"
          onClick={() => setShowOwnerModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 w-[400px] shadow-xl"
          >
            <h3 className="text-lg font-bold mb-4">Owner Information</h3>

            <p>
              Name:
              {item.reportedBy?.fullName}
            </p>

            <p>
              Email:
              {item.reportedBy?.email}
            </p>

            <p>
              Phone:
              {item.reportedBy?.phoneNumber}
            </p>

            <button
              onClick={() => setShowOwnerModal(false)}
              className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}

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