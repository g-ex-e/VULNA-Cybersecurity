import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaGithub, FaSearch, FaStar
} from "react-icons/fa";
import { VscRepoForked } from "react-icons/vsc";
import {
  GoCode, GoIssueOpened, GoGitPullRequest, GoPlay, GoProject, GoShield, GoGraph
} from "react-icons/go";
import {
  FiFileText, FiFolder
} from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import { BsPencil, BsDownload, BsBoxArrowUpRight } from "react-icons/bs";
import { HiOutlineClipboardCopy } from "react-icons/hi";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaCodeBranch } from "react-icons/fa";
import Editor from "@monaco-editor/react";

const fileTree = {
  public: [
    { name: "index.html", type: "file" },
    { name: "favicon.ico", type: "file" }
  ],
  src: [
    { name: "App.js", type: "file" },
    { name: "Main.jsx", type: "file" },
    { name: "utils.js", type: "file" },
    { name: "styles", type: "folder" }
  ],
  styles: [
    { name: "main.css", type: "file" },
    { name: "theme.css", type: "file" }
  ],
  backend: [
    { name: "server.js", type: "file" },
    { name: "routes", type: "folder" }
  ],
  routes: [
    { name: "inmail.js", type: "file" }
  ]
}


const rootFiles = [
  { name: "public", type: "folder" },
  { name: "src", type: "folder" },
  { name: "backend", type: "folder" },
  { name: "package.json", type: "file" },
  { name: "README.md", type: "file" }
]


export default function PDFReaderMain() {

  const [code, setCode] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [expanded, setExpanded] = useState({
    public: true,
    src: true,
    styles: true,
    backend: true,   // 👈 nouveau dossier ouvert par défaut
    routes: true     // 👈 sous-dossier aussi
  });

  
useEffect(() => {
  axios.get("http://localhost:1414/api/save-main")
    .then((res) => setCode(res.data || ""))
    .catch(() => setCode(""));
}, []);

  

  const toggleFolder = (name) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSave = async () => {
    try {
      await axios.post("http://localhost:1414/api/save-main", { code });
      setSaveStatus("✅ Fichier enregistré");
      setIsEditing(false);
    } catch {
      setSaveStatus("❌ Erreur lors de la sauvegarde");
    }
  };

  const renderTree = (items, parent = "") => (
    <div className="pl-4">
      {items.map(item => {
        const fullPath = `${parent}/${item.name}`;
        const isCurrent = item.name === "server.js";
        const isFolder = item.type === "folder";
        return (
          <div key={fullPath}>
            <div
              className={`flex items-center cursor-pointer px-2 py-1 rounded hover:bg-gray-100 ${isCurrent ? "bg-gray-200 font-semibold" : "text-gray-800"}`}
              onClick={() => isFolder && toggleFolder(item.name)}
            >
              {isFolder ? (
                <FiFolder className="text-blue-500 mr-2" />
              ) : (
                <FiFileText className="text-gray-500 mr-2" />
              )}
              <span>{item.name}</span>
            </div>
            {isFolder && expanded[item.name] && renderTree(fileTree[item.name] || [], item.name)}
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="bg-white text-[15px] font-sans">
      {/* Top Nav */}
      <div className="bg-[#282c2c] px-8 py-4 flex items-center justify-between text-[16px] text-white">
        <div className="flex space-x-6 items-center">
          <FaGithub className="text-[28px] mr-2" />
          {["Product", "Solutions", "Resources", "Open Source", "Enterprise"].map(label => (
            <span key={label} className="cursor-pointer">{label} <IoIosArrowDown className="inline text-xs" /></span>
          ))}
          <span className="cursor-pointer">Pricing</span>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-[#818b98] text-sm" />
            <input
              type="text"
              placeholder="Search or jump to..."
              className="pl-8 pr-3 py-1.5 rounded border border-[#818b98] bg-[#282c2c] text-[13px] text-[#818b98] placeholder-[#c0cccc] w-80"
            />
          </div>
          <button className="px-3 py-1 rounded text-[13px] text-white">Sign in</button>
          <button className="border border-gray-400 px-3 py-1 rounded text-[13px] text-white">Sign up</button>
        </div>
      </div>

      {/* === SUB NAV === */}
      <div className="bg-[#f6f8fa] px-10 py-4 border-b">
        <div className="flex justify-between items-center text-[#0969da]">
          <div className="flex items-center text-[20px] space-x-1">
            <a href="#" className="hover:underline">Docucloud</a>
            <span className="text-gray-500">/</span>
            <a href="http://github.localhost:3698/" className="font-semibold hover:underline">PDF-Reader</a>
            <span className="ml-2 text-gray-500 text-xs border border-gray-300 rounded px-2 py-0.5 font-semibold">Public</span>
          </div>
          <div className="flex space-x-2 text-[14px]">
            <button className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-gray-700 font-semibold">Notifications</button>
            <button className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-gray-700 font-semibold flex items-center space-x-1">
              <VscRepoForked className="text-sm" />
              <span>Fork</span>
              <span className="bg-gray-200 text-xs px-1.5 py-0.5 rounded">3</span>
            </button>
            <button className="border border-gray-300 rounded px-3 py-1 hover:bg-gray-100 text-gray-700 font-semibold flex items-center space-x-1">
              <FaStar className="text-sm" />
              <span>Star</span>
              <span className="bg-gray-200 text-xs px-1.5 py-0.5 rounded">6</span>
            </button>
          </div>
        </div>
        {/* === TABS === */}
        <nav className="mt-4 flex space-x-8 text-[16px] text-gray-700">
          <span className="flex items-center space-x-1 font-semibold text-black border-b-2 border-orange-500 pb-1">
            <GoCode />
            <span>Code</span>
          </span>
          {[["Issues", GoIssueOpened], ["Pull requests", GoGitPullRequest], ["Actions", GoPlay], ["Projects", GoProject], ["Security", GoShield], ["Insights", GoGraph]].map(([label, Icon]) => (
            <span key={label} className="flex items-center space-x-1 hover:text-blue-600 cursor-pointer">
              <Icon />
              <span>{label}</span>
            </span>
          ))}
        </nav>
      </div>

      <div className="flex flex-1">
        {/* SIDEBAR FILES */}
        <aside className="w-[260px] bg-white border-r text-sm pt-4">
          <div className="px-4">
            <h2 className="text-gray-700 font-semibold mb-2 flex items-center">
              <RxHamburgerMenu className="text-lg mr-2" /> Files
            </h2>
{/* Branch selector + search button aligned right */}
<div className="flex items-center mt-2 mb-3">
  {/* Branch button (fills available space) */}
  <div className="flex-1 relative">
    <button className="w-full flex items-center justify-start px-3 py-1.5 pr-8 border border-gray-300 rounded-md bg-[#f6f8fa] text-sm text-gray-800 font-semibold">
      <FaCodeBranch className="w-4 h-4 mr-2 text-gray-600" />
      <span>main</span>
    </button>
    <IoIosArrowDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-600 pointer-events-none" />
  </div>

  {/* Search icon button with spacing */}
  <button className="ml-2 p-2 border border-gray-300 rounded-md bg-[#f6f8fa] hover:bg-gray-200">
    <FaSearch className="text-gray-500 w-4 h-4" />
  </button>
</div>

<div className="relative mb-3">
  <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[15px]" />
  <input
    type="text"
    placeholder="Go to file"
    className="pl-8 w-full py-2 text-[13px] border border-gray-300 rounded text-gray-800"
  />
</div>
          </div>
          <div className="mt-4 px-4">
            {renderTree(rootFiles)}
          </div>
        </aside>

        {/* MAIN FILE VIEWER */}
        <div className="flex-1 px-10 pb-10 bg-white min-h-[calc(100vh-160px)] mt-2">
          {/* === Header File Path === */}
<div className="flex items-center justify-between px-4 py-2 text-lg text-[#0969da] mb-3">
  {/* Left: Path + Copy */}
  <div className="flex items-center space-x-1">
    <a href="http://github.localhost:3698/" className="hover:underline font-semibold">PDF-Reader</a>
    <span className="text-gray-500">/</span>
    <span className="text-black font-semibold">server.js</span>
    <button
      className="ml-2"
      onClick={() => navigator.clipboard.writeText("PDF-Reader/server.js")}
    >
      <HiOutlineClipboardCopy className="text-gray-600 hover:text-black w-4 h-4" />
    </button>
  </div>

  {/* Right: 3-dots button (does nothing) */}
  <button className="p-1 hover:bg-gray-200 rounded border border-gray-300">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-4 h-4 text-gray-700"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0zm6 0a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  </button>
</div>

        {/* === Commit info bar === */}
  <div className="flex items-center justify-between border px-4 py-2 bg-white text-sm mb-4"> {/* ici */}
  <div className="flex items-center gap-2">
    <div className="w-6 h-6 rounded-full bg-gray-300" />
    <span className="font-semibold text-black">trn</span>
    <span className="text-gray-600">first commit</span>
  </div>
  <div className="flex items-center gap-3 text-xs text-gray-600">
    <span className="hover:underline cursor-pointer text-gray-600">7761264</span>
    <span className="text-gray-500">• 2 years ago</span>
    <div className="flex items-center gap-1 text-gray-600 hover:underline cursor-pointer">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="text-gray-500 font-semibold">History</span>
      </div>
  </div>
</div>

{/* === Tabs + Action buttons bar === */}
<div className="flex justify-between items-center bg-[#f6f8fa] text-sm px-4 py-2 border rounded-md">
  {/* Tabs + File info */}
  <div className="flex items-center">
    <div className="flex overflow-hidden rounded-md border">
      <button className="px-4 py-1 font-semibold text-sm bg-white border-r">Code</button>
      <button className="px-4 py-1 text-sm text-gray-600 hover:text-black">Blame</button>
    </div>
    <span className="ml-4 text-xs text-gray-500">
      {code.split('\n').length} lines ({code.split('\n').length} loc) • 1.33 KB
    </span>
  </div>

  {/* Buttons */}
  <div className="flex items-center space-x-px">
    <button title="Raw" className="border rounded px-2 py-1"><BsBoxArrowUpRight /></button>
    <button title="Copy" className="border rounded px-2 py-1" onClick={() => navigator.clipboard.writeText(code)}><HiOutlineClipboardCopy /></button>
    <button title="Download" className="border rounded px-2 py-1" onClick={() => {
      const blob = new Blob([code], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "server.js";
      a.click();
    }}><BsDownload /></button>
    <button title="Edit" className="border rounded px-2 py-1" onClick={() => setIsEditing(true)}><BsPencil /></button>
    <button title="More options" className="border rounded px-2 py-1 ml-2"><IoIosArrowDown /></button>
  </div>
</div>


<div className="border border-gray-300 border-t-0 font-mono text-sm bg-white">
  <Editor
    height="500px"
    defaultLanguage="javascript"
    value={code}
    onChange={(value) => {
      if (isEditing && value !== undefined) {
        setCode(value);
      }
    }}
    theme="vs-light"
    options={{
      readOnly: !isEditing,
      readOnlyMessage: false,
      fontSize: 14,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: "on",
      automaticLayout: true,
      stickyScroll: { enabled: false },
    }}
  />
</div>


          {isEditing && (
            <div className="flex justify-end mt-2">
              <button onClick={handleSave} className="bg-[#0969da] hover:bg-[#096bdae0] text-white text-sm px-4 py-2 rounded">
                Enregistrer
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="ml-2 bg-gray-300 hover:bg-gray-400 text-sm px-4 py-2 rounded"
              >
                Annuler
              </button>
            </div>
          )}
{saveStatus && (
  <div className="mt-4 flex items-center gap-2 border border-gray-300 rounded-md px-4 py-2 bg-[#f6f8fa] text-sm text-gray-800">
    {saveStatus.includes("Erreur") ? (
      <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 19a7 7 0 100-14 7 7 0 000 14z" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    )}
    <span>{saveStatus.replace("✅ ", "").replace("❌ ", "")}</span>
  </div>
)}

        </div>
      </div>
    </div>
  );
}
