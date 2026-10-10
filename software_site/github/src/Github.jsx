import React, { useState } from "react";
import {
  FaGithub, FaCodeBranch, FaStar, FaEye, FaSearch
} from "react-icons/fa";
import { VscRepoForked } from "react-icons/vsc";
import {
  FiFileText, FiFolder, FiBookOpen, FiBarChart2
} from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import {
  GoCode, GoIssueOpened, GoGitPullRequest, GoPlay, GoProject, GoShield, GoGraph
} from "react-icons/go";
import { GoTag } from "react-icons/go";
import { GoBell } from "react-icons/go";
import { useNavigate } from "react-router-dom";



const fakeFiles = [
  { name: "public", type: "folder" },
  { name: "src", type: "folder" },
  { name: "backend", type: "folder" }, // 👈 nouveau
  { name: "package.json", type: "file" },
  { name: "README.md", type: "file" }
]


const folderContents = {
  public: [
    { name: "index.html", type: "file" },
    { name: "favicon.ico", type: "file" }
  ],
  src: [
    { name: "App.js", type: "file" },
    { name: "Main.jsx", type: "file" }, // ❗non cliquable mais affiché
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
    { name: "inmail.js", type: "file" } // 👈 non cliquable
  ]
}


export default function GitHubRepoClone() {
  const [expanded, setExpanded] = useState({});
  const navigate = useNavigate();

  const handleFileClick = (fileName, folderName = '') => {
    if (folderName === 'backend' && fileName === 'server.js') {
      navigate('/server.js') // ✅ cible modifiable
    }
  
  };
  

  const toggleFolder = (folder) => {
    setExpanded((prev) => ({ ...prev, [folder]: !prev[folder] }));
  };

  const renderFolderContents = (folder, depth = 1) => {
    const contents = folderContents[folder] || [];
    return contents.map((child) => (
      <React.Fragment key={child.name}>
        <div
          className="flex items-center px-4 py-2 text-sm hover:bg-gray-50"
          style={{ paddingLeft: `${depth * 2}rem` }}
          onClick={() => {
            if (child.type === "folder") {
              toggleFolder(child.name);
            } else {
              handleFileClick(child.name, folder); // 👈 passe le parent
            }
          }}
          
        >
          {child.type === 'folder' ? (
            <FiFolder className="mr-3 text-blue-400" />
          ) : (
            <FiFileText className="mr-3 text-gray-400" />
          )}
          <span className="text-black hover:underline cursor-pointer">{child.name}</span>
        </div>
        {child.type === 'folder' && expanded[child.name] && renderFolderContents(child.name, depth + 1)}
      </React.Fragment>
    ));
  };

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

{/* Repo Info */}
<header className="bg-[#f6f8fa] text-[#0969da] px-10 py-4">
  <div className="flex justify-between items-center">
    {/* Repo Path */}
    <div className="flex items-center space-x-1 text-[20px]">
      <a href="#" className="hover:underline">Docucloud</a>
      <span className="text-gray-500">/</span>
      <a href="#" className="hover:underline font-semibold">PDF-Reader</a>
      <span className="text-gray-500 text-xs font-semibold border border-gray-300 px-2 py-0.5 rounded ml-2">Public</span>
    </div>

    {/* Action buttons */}
    <div className="flex space-x-2 text-[14px]">
      <button className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-gray-700 font-semibold">
      <GoBell className="text-sm" />
      <span>Notifications</span>
      </button>
      <button className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-gray-700 font-semibold">
        <VscRepoForked className="text-sm" />
        <span>Fork</span>
        <span className="bg-gray-200 text-xs px-1.5 py-0.5 rounded">3</span>
      </button>
      <button className="flex items-center space-x-1 px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 text-gray-700 font-semibold">
        <FaStar className="text-sm" />
        <span>Star</span>
        <span className="bg-gray-200 text-xs px-1.5 py-0.5 rounded">6</span>
      </button>
    </div>
  </div>
</header>


      {/* Tabs */}
      <nav className="border-b bg-[#f6f8fa] px-10 py-2 flex space-x-8 text-[16px] text-gray-700">
        <span className="flex items-center space-x-1 font-semibold text-black border-b-2 border-orange-500 pb-1">
          <GoCode />
          <span>Code</span>
        </span>
        {[['Issues', GoIssueOpened], ['Pull requests', GoGitPullRequest], ['Actions', GoPlay], ['Projects', GoProject], ['Security', GoShield], ['Insights', GoGraph]].map(([label, Icon]) => (
          <span key={label} className="flex items-center space-x-1 hover:text-blue-600 cursor-pointer">
            <Icon />
            <span>{label}</span>
          </span>
        ))}
      </nav>

      {/* Main */}
      <div className="flex justify-center p-8">
        <div className="flex max-w-7xl w-full">
          {/* Left - File list */}
          <div className="flex-1">
            {/* Branch info */}
            <div className="flex items-center justify-between text-[13px] mb-4">
  <div className="flex items-center space-x-4 text-[#0969da]">
    <div className="flex items-center border rounded px-2 py-0.5 bg-[#f6f8fa] border-gray-300 text-black font-semibold">
      <FaCodeBranch className="mr-1" />
      <span className="mr-1">main</span>
      <IoIosArrowDown className="text-xs mt-[1px]" />
    </div>
    <div className="flex items-center space-x-1">
      <FaCodeBranch className="text-[#59636e]" />
      <span className="text-sm text-[#59636e] font-semibold">1 Branch</span>
    </div>
    <div className="flex items-center space-x-1">
    <GoTag className="text-[#59636e]" />
    <span className="text-sm text-[#59636e] font-semibold">0 Tags</span>
    </div>
  </div>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <FaSearch className="absolute left-2 top-1/2 -translate-y-1/2 text-[#59636e] text-sm" />
                  <input
                    type="text"
                    placeholder="Go to file"
                    className="pl-7 pr-3 py-1.5 rounded border border-[#d1d9e0] text-[#59636e] placeholder-[#59636e] w-64 text-[14px]"
                  />
                </div>
                <button className="flex items-center space-x-2 bg-[#1f883d] text-white px-3.5 py-1.5 text-[14px] font-semibold rounded">
                  <GoCode className="text-white" />
                  <span>Code</span>
                  <IoIosArrowDown className="text-white text-sm" />
                </button>
              </div>
            </div>

            {/* Commit summary */}
            <div className="border border-gray-200 border-b-0 bg-gray-50 rounded-t-md px-4 py-3 flex justify-between items-center text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-full bg-gray-300" />
                <span className="font-medium">trn</span>
              </div>
              <div className="flex items-center space-x-4 text-gray-500 text-xs">
                <span className="hidden sm:inline">cb4710b</span>
                <span>2 years ago</span>
                <span className="flex items-center space-x-1">
                  <FaCodeBranch className="text-[12px]" />
                  <span className="font-semibold">4 Commits</span>
                </span>
              </div>
            </div>

            {/* File list */}
            <div className="border border-gray-200 rounded-b-md overflow-hidden">
              {fakeFiles.map((file, index) => (
                <React.Fragment key={file.name}>
                  <div
                    className={`flex items-center px-4 py-3 text-sm ${index !== fakeFiles.length - 1 ? 'border-b border-gray-200' : ''} hover:bg-gray-50 cursor-pointer`}
                    onClick={() => {
                      if (file.type === "folder") {
                        toggleFolder(file.name);
                      } else {
                        handleFileClick(file.name);
                      }
                    }}
                                      >
                    {file.type === 'folder' ? (
                      <FiFolder className="mr-3 text-blue-500" />
                    ) : (
                      <FiFileText className="mr-3 text-gray-500" />
                    )}
                    <span className="text-black hover:underline">{file.name}</span>
                    <span className="ml-auto text-gray-500 text-xs">2 years ago</span>
                  </div>
                  {file.type === 'folder' && expanded[file.name] && renderFolderContents(file.name)}
                </React.Fragment>
              ))}
            </div>

{/* README */}
<div className="mt-8 border-t pt-4">
<div className="flex items-center space-x-2 mb-2 border-b-2 border-orange-500 w-fit pb-1">
  <FiBookOpen />
  <span className="text-[16px] font-semibold">README</span>
</div>
  <div className="bg-white p-5 rounded border text-[15px] leading-relaxed">
  <h1 className="text-3xl font-semibold mb-2">
  DocuCloud PDF Reader – Simulated Application
  <hr className="border-t border-gray-300 my-4 w-full" />
    </h1>
    <p>
      <strong>DocuCloud PDF Reader</strong> is a simulated cloud-based PDF rendering service built as part of an internal document management prototype.
      Designed for rapid document previewing and secure sharing, it serves as a minimal proof-of-concept that mimics behavior of enterprise file handling systems.
    </p>

    <p className="mt-2">
      This repository showcases how document uploads, preview generation, and dynamic rendering could be implemented using a lightweight JavaScript frontend and Node.js backend.
      Please note this is not a production-ready application, but a <strong>realistic testing ground</strong> for safe vulnerability discovery.
    </p>

    <p className="mt-4">
      <strong>⚠️ Disclaimer:</strong> This project is used as-is in some internal applications. Please note that modifying any core files may reflect directly on production instances using this repository.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">Features</h2>
    <hr className="border-t border-gray-300 my-4 w-full" />
    <ul className="list-disc ml-6 space-y-1">
      <li>Drag-and-drop PDF upload interface</li>
      <li>Inline PDF preview with pagination</li>
      <li>Dynamic file rendering via embedded iframe component</li>
      <li>Basic file listing and metadata display</li>
    </ul>

    <h2 className="text-2xl font-semibold mt-6 mb-2">Usage</h2>
    <hr className="border-t border-gray-300 my-4 w-full" />
    <p>To spin up the project locally:</p>
    <pre className="bg-gray-100 p-3 rounded mt-2 text-sm overflow-auto whitespace-pre-wrap">
      <code>
        {"git clone https://github.com/docucloud/pdf-reader.git\n" +
         "cd pdf-reader\n" +
         "npm install\n" +
         "npm run dev"}
      </code>
    </pre>

    <p className="mt-3">
      Once running, navigate to <code>http://localhost:3000</code> and upload a sample PDF to preview its content.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">Security Notes</h2>
    <hr className="border-t border-gray-300 my-4 w-full" />
    <p>
      The application currently does <strong>not validate file types or sanitize embedded scripts</strong> in uploaded documents.
      As such, it may be vulnerable to malicious input such as JavaScript payloads within embedded PDFs. This behavior is intentional and used as part of a simulated attack chain demo.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">Contributing</h2>
    <hr className="border-t border-gray-300 my-4 w-full" />
    <p>
      This lab is not open to external contributions but serves as a demonstration for internal red team operations, awareness training, and secure coding workshops.
    </p>

    <h2 className="text-2xl font-semibold mt-6 mb-2">License</h2>
    <hr className="border-t border-gray-300 my-4 w-full" />
    <p>
      MIT – For educational use only.
    </p>
  </div>
</div>
</div>
{/* Right sidebar */}
<aside className="w-72 ml-10">
  <div className="p-1 text-[16px] space-y-4">
    <div>
    <span className="font-semibold">About</span>
    <p className="text-[#60646c] mt-1">PDF-Reader Test Version 1 - Transform PDF to text</p>
    </div>

    <div className="flex flex-col text-[#60646c] space-y-1">
      {[['Readme', FiBookOpen], ['Activity', FiBarChart2], ['6 stars', FaStar], ['1 watching', FaEye], ['3 forks', VscRepoForked]].map(([text, Icon]) => (
        <div key={text} className="flex items-center space-x-2">
          <Icon className="text-[16px]" />
          <span>{text}</span>
        </div>
      ))}
      <span className="text-[#60646c] text-[16px] cursor-pointer hover:underline">Report repository</span>
    </div>

              <div>
              <hr className="my-4 border-t border-gray-300" />
              <span className="font-semibold">Releases</span>
              <p className="text-gray-600 text-[15px]">No releases published</p>
              </div>
              <div>
              <hr className="my-4 border-t border-gray-300" />
              <span className="font-semibold">Packages</span>
              <p className="text-gray-600 text-[15px]">No packages published</p>
              </div>
              <div>
              <hr className="my-4 border-t border-gray-300" />
                <strong>Languages</strong>
                <div className="mt-2">
  {/* Bar */}
  <div className="h-2 rounded bg-gray-200 overflow-hidden mb-2 flex">
    <div className="bg-yellow-500" style={{ width: "68.6%" }}></div>
    <div className="bg-blue-500" style={{ width: "17.1%" }}></div>
    <div className="bg-orange-500" style={{ width: "14.3%" }}></div>
  </div>

  {/* Legend */}
  <div className="space-y-1 text-[14px]">
    <div className="flex items-center space-x-2">
      <span className="inline-block w-2 h-2 rounded-full bg-yellow-500"></span>
      <span>JavaScript</span>
      <span className="text-gray-600 ml-auto">68.6%</span>
    </div>
    <div className="flex items-center space-x-2">
      <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
      <span>CSS</span>
      <span className="text-gray-600 ml-auto">17.1%</span>
    </div>
    <div className="flex items-center space-x-2">
      <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span>
      <span>HTML</span>
      <span className="text-gray-600 ml-auto">14.3%</span>
    </div>
  </div>
</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
