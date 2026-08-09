import { Challenge } from '../../types';

export const CYBERSECURITY_ROADMAP: Challenge[] = Array.from({ length: 60 }, (_, index) => {
  const dayId = index + 1;

  if (dayId <= 10) {
    const topics = [
      "Linux Command Line Fundamentals & File Permissions",
      "Process Inspection, Signal Handling & System Logging",
      "Networking Protocols: TCP/IP, OSI Model & Packets",
      "Wireshark Packet Capture & Network Flow Analysis",
      "DNS Protocol, Record Types & Spoofing Risks",
      "HTTP/HTTPS Protocol: Headers, Verbs & Status Codes",
      "TLS/SSL Encryption, Handshakes & Certificates",
      "Ports, Services & Nmap Network Scanning",
      "Basic Hashing Algorithms: MD5, SHA-256 & Salting",
      "Symmetric vs Asymmetric Cryptography Fundamentals"
    ];
    return {
      dayId,
      trackId: 'cybersecurity',
      title: `Day ${dayId}: ${topics[dayId - 1]}`,
      description: `Master fundamental security primitives in ${topics[dayId - 1]}. Build essential system and network security mental models.`,
      requirements: [
        `Execute hands-on commands/labs demonstrating ${topics[dayId - 1]}`,
        "Analyze security logs, protocol packets, or hash outputs",
        "Document defensive measures and risk mitigation steps"
      ],
      learningObjective: `Understand core system and network mechanics for ${topics[dayId - 1]}.`,
      whyItMatters: "Security engineering starts with understanding standard protocols before identifying flaws.",
      challengeType: 'build',
      difficulty: 'beginner',
      estimatedMinutes: 30,
      curiosityPrompt: "How do attackers exploit unencrypted network traffic vs TLS-protected streams?",
      skills: ["Linux CLI", "Networking", "Wireshark", "Cryptography Basics"],
      tools: ["Linux Terminal", "Wireshark", "Nmap", "OpenSSL"],
      stage: 'discover',
      stageName: 'Stage 1 — Discover (Days 1–10)'
    };
  } else if (dayId <= 25) {
    const topics = [
      "OWASP Top 10 Overview & Vulnerability Taxonomies",
      "SQL Injection (SQLi): Identification & Remediation",
      "Cross-Site Scripting (XSS): Stored, Reflected & DOM-based",
      "Cross-Site Request Forgery (CSRF) & SameSite Cookies",
      "Authentication Flaws & Broken Access Control (IDOR)",
      "Security Misconfigurations & Unprotected Endpoints",
      "Server-Side Request Forgery (SSRF) Attacks & Defenses",
      "Command Injection & Input Sanitization Bypasses",
      "Path Traversal & Local/Remote File Inclusion (LFI/RFI)",
      "Insecure Deserialization Hazards",
      "Security Headers: CSP, HSTS, X-Frame-Options",
      "JWT Security: Signature Verification & Algorithm Confusion",
      "Password Hashing & Bcrypt/Argon2 Implementation",
      "Rate Limiting & Brute-Force Protection Strategies",
      "Web Application Firewalls (WAF) & Rule Rulesets"
    ];
    const topic = topics[(dayId - 11) % topics.length];
    return {
      dayId,
      trackId: 'cybersecurity',
      title: `Day ${dayId}: ${topic}`,
      description: `Investigate and mitigate web application vulnerabilities involving ${topic}.`,
      requirements: [
        `Analyze vulnerable code sample and demonstrate exploit mechanism for ${topic}`,
        "Refactor code to implement effective defensive countermeasures",
        "Verify security fix prevents attack vector without breaking functionality"
      ],
      learningObjective: `Identify, exploit safely in lab, and fix ${topic}.`,
      whyItMatters: "Web vulnerabilities account for over 70% of modern breach initial access vectors.",
      challengeType: 'solve',
      difficulty: 'intermediate',
      estimatedMinutes: 45,
      curiosityPrompt: "How can Content Security Policy (CSP) headers block inline script execution?",
      skills: ["OWASP Top 10", "Web Security", "Exploit Analysis", "Remediation"],
      tools: ["Burp Suite", "OWASP ZAP", "Chrome DevTools"],
      stage: 'build',
      stageName: 'Stage 2 — Build (Days 11–25)'
    };
  } else if (dayId <= 35) {
    const topics = [
      "Subdomain Enumeration & Passive Reconnaissance",
      "Active Port Scanning & Service Fingerprinting with Nmap",
      "Directory Fuzzing with Gobuster / ffuf",
      "API Security Auditing: GraphQL & REST Endpoints",
      "Static Application Security Testing (SAST) with Semgrep",
      "Dynamic Application Security Testing (DAST) Automation",
      "Software Supply Chain Audit: npm audit & Dependency Check",
      "Container Vulnerability Scanning with Trivy",
      "Cloud IAM Role Security & Least Privilege Audit",
      "Security Incident Log Analysis with ELK / Splunk"
    ];
    const topic = topics[(dayId - 26) % topics.length];
    return {
      dayId,
      trackId: 'cybersecurity',
      title: `Day ${dayId}: ${topic}`,
      description: `Automate security scanning and reconnaissance leveraging ${topic}.`,
      requirements: [
        `Configure security tools to audit applications for ${topic}`,
        "Filter false positives and extract actionable vulnerability reports",
        "Document remediations for development engineering teams"
      ],
      learningObjective: `Master security tooling and vulnerability identification using ${topic}.`,
      whyItMatters: "Automated security tooling allows engineering teams to detect flaws before production release.",
      challengeType: 'experiment',
      difficulty: 'intermediate',
      estimatedMinutes: 45,
      curiosityPrompt: "How do SAST AST engines parse Abstract Syntax Trees to find unsafe code patterns?",
      skills: ["Semgrep", "Nmap", "Trivy", "SAST / DAST"],
      tools: ["Semgrep", "Gobuster", "Trivy", "Burp Suite"],
      stage: 'experiment',
      stageName: 'Stage 3 — Experiment (Days 26–35)'
    };
  } else if (dayId <= 45) {
    const topics = [
      "CTF Lab: Bypassing Broken Authentication Controls",
      "CTF Lab: Exploiting Blind SQL Injection via Time Delays",
      "CTF Lab: Cross-Site Request Forgery Exploit Payload",
      "CTF Lab: SSRF to Cloud Metadata Service (169.254.169.254)",
      "CTF Lab: Privilege Escalation via SUID Binaries",
      "Secure Code Review: Node.js & Express Security Audit",
      "Secure Code Review: Python FastAPI & Async Security Audit",
      "DevSecOps Pipeline: Integrating Security in GitHub Actions",
      "Secrets Detection in Git History with Trufflehog",
      "Infrastructure as Code Security Auditing with Checkov"
    ];
    const topic = topics[(dayId - 36) % topics.length];
    return {
      dayId,
      trackId: 'cybersecurity',
      title: `Day ${dayId}: ${topic}`,
      description: `Solve real-world security challenge lab focusing on ${topic}.`,
      requirements: [
        `Capture the flag or conduct security audit for ${topic}`,
        "Provide detailed root cause analysis writeup",
        "Provide patch code pull-request verifying safety"
      ],
      learningObjective: `Apply offensive and defensive skills to resolve ${topic}.`,
      whyItMatters: "Hands-on penetration testing and secure code review build practical job readiness.",
      challengeType: 'solve',
      difficulty: 'advanced',
      estimatedMinutes: 50,
      curiosityPrompt: "Why are hardcoded API keys in Git commit histories so dangerous for organizations?",
      skills: ["Penetration Testing", "DevSecOps", "Secure Code Review", "CTF"],
      tools: ["GitHub Actions", "Trufflehog", "Checkov", "Burp Suite"],
      stage: 'real-world',
      stageName: 'Stage 4 — Real-World Problems (Days 36–45)'
    };
  } else if (dayId <= 55) {
    const topics = [
      "Secure Web Portal: Architecture & Threat Model (STRIDE)",
      "Secure Web Portal: Zero-Trust Authentication Engine",
      "Secure Web Portal: Web Cryptography & End-to-End Encryption",
      "Secure Web Portal: Fine-Grained Role-Based Access Control (RBAC)",
      "Secure Web Portal: Input Validation & Output Encoding Filters",
      "Secure Web Portal: Immutable Audit Log System",
      "Secure Web Portal: Rate Limiting & Bot Defense Layer",
      "Secure Web Portal: Automated Security Test Suite",
      "Secure Web Portal: Vulnerability Disclosure & Policy",
      "Secure Web Portal: Penetration Test Simulation Report"
    ];
    const topic = topics[(dayId - 46) % topics.length];
    return {
      dayId,
      trackId: 'cybersecurity',
      title: `Day ${dayId}: ${topic}`,
      description: `Build your own hardened application infrastructure implementing ${topic}.`,
      requirements: [
        `Design and write code for ${topic}`,
        "Conduct threat modeling and document security controls",
        "Perform regression tests against OWASP Top 10 exploits"
      ],
      learningObjective: `Construct a complete secure application system incorporating ${topic}.`,
      whyItMatters: "Building secure-by-default software proves engineering excellence to top tech firms.",
      challengeType: 'project',
      difficulty: 'advanced',
      estimatedMinutes: 60,
      curiosityPrompt: "How does STRIDE threat modeling systematically identify security architecture flaws?",
      skills: ["STRIDE", "Zero-Trust", "Security Engineering", "Cryptography"],
      tools: ["VS Code", "Docker", "Node.js / Python"],
      stage: 'build-your-own',
      stageName: 'Stage 5 — Build Your Own (Days 46–55)'
    };
  } else {
    const topics = [
      "Full Security Audit & Vulnerability Assessment Report",
      "CI/CD DevSecOps Automation with Automated Gate Blocking",
      "Hardened Cloud Container Deployment with Cloud Armor WAF",
      "Penetration Test Executive Summary & Technical Report",
      "Public Security Architecture Diagram & Documentation",
      "Cybersecurity Portfolio Showcase & GitHub Release"
    ];
    const topic = topics[(dayId - 56) % topics.length];
    return {
      dayId,
      trackId: 'cybersecurity',
      title: `Day ${dayId}: ${topic}`,
      description: `Finalize your cybersecurity engineering portfolio with ${topic}.`,
      requirements: [
        `Publish comprehensive security deliverables for ${topic}`,
        "Provide public GitHub repository with security audit report",
        "Record demonstration video showing defense verification"
      ],
      learningObjective: `Deploy and showcase production-grade security engineering work with ${topic}.`,
      whyItMatters: "Demonstrating thorough security audits and hardened codebases sets you apart in application security roles.",
      challengeType: 'project',
      difficulty: 'advanced',
      estimatedMinutes: 60,
      curiosityPrompt: "How do security engineers balance strict security controls with developer velocity?",
      skills: ["DevSecOps", "Cloud Security", "Vulnerability Reporting", "PenTest"],
      tools: ["GitHub", "Cloud Armor", "OWASP ZAP"],
      stage: 'showcase',
      stageName: 'Stage 6 — Showcase (Days 56–60)'
    };
  }
});
