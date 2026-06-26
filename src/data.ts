import { PortfolioData } from './types';

export const DEFAULT_PORTFOLIO_DATA: PortfolioData = {
  profile: {
    name: "Alex Thorne",
    title: "Security Analyst & Threat Hunter",
    bio: "Passionate about offensive security, reverse engineering, and defensive hardening. Experienced in automated log analysis, penetration testing, and designing secure network architectures. Dedicated to continuous learning and proactive threat mitigation.",
    email: "alex.thorne.sec@example.com",
    github: "https://github.com",
    linkedin: "https://linkedin.com",
    website: "https://example.com",
    statusText: "Currently researching automated malware evasion techniques."
  },
  projects: [
    {
      id: "proj-1",
      title: "Active Directory Lab Hardening",
      description: "Designed, built, and defended a multi-forest Active Directory environment. Implemented Group Policy Objects (GPOs) to enforce CIS benchmarks, configured AppLocker to block unauthorized binaries, and integrated Windows Event Forwarding (WEF) with a centralized Syslog server for real-time alerting.",
      category: "Defensive Security",
      status: "Completed",
      tags: ["Active Directory", "GPO", "Sysmon", "PowerShell", "Blue Teaming"],
      githubLink: "https://github.com",
      date: "2026-04-12"
    },
    {
      id: "proj-2",
      title: "Vulnerability Assessment: WebPortal Alpha",
      description: "Performed a comprehensive grey-box penetration test of a mock enterprise web portal. Discovered and safely exploited 3 critical vulnerabilities, including SQL injection (SQLi) leading to database dumping, and stored Cross-Site Scripting (XSS) allowing session hijacking. Compiled a remediation report.",
      category: "Penetration Testing",
      status: "Completed",
      tags: ["Web Pentesting", "Burp Suite", "OWASP Top 10", "SQLi", "XSS"],
      githubLink: "https://github.com",
      reportLink: "https://example.com/report.pdf",
      date: "2026-05-18"
    },
    {
      id: "proj-3",
      title: "Automated PE Malware Sandbox Analyzer",
      description: "A lightweight Python-based tool that executes untrusted Portable Executable (PE) files inside an isolated container, monitors basic system API calls, logs network connections, and parses PE headers to score potential indicators of compromise (IoC).",
      category: "Reverse Engineering",
      status: "In Progress",
      tags: ["Python", "Malware Analysis", "Sandbox", "YARA Rules", "PEfile"],
      githubLink: "https://github.com",
      date: "2026-06-01"
    },
    {
      id: "proj-4",
      title: "CTF Challenge Authoring: CyberSecCon 2026",
      description: "Authored three jeopardy-style Capture The Flag challenges focusing on cryptography (RSA custom padding attacks) and reverse engineering (unpacking custom-compiled ELF binaries). Facilitated for over 500 active concurrent participants.",
      category: "Cryptography",
      status: "Completed",
      tags: ["CTF", "RSA", "GDB", "Ghidra", "Linux RE"],
      githubLink: "https://github.com",
      date: "2026-02-15"
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "CompTIA Security+",
      issuer: "CompTIA",
      issueDate: "2025-08-10",
      credentialId: "SEC-9847294829",
      verificationLink: "https://comptia.org",
      status: "Active"
    },
    {
      id: "cert-2",
      name: "Offensive Security Certified Professional (OSCP)",
      issuer: "OffSec",
      issueDate: "2026-03-22",
      credentialId: "OSCP-38291",
      verificationLink: "https://offsec.com",
      status: "Active"
    },
    {
      id: "cert-3",
      name: "Certified Information Systems Security Professional (CISSP)",
      issuer: "ISC2",
      issueDate: "2027-12-01",
      status: "Planned"
    }
  ]
};
