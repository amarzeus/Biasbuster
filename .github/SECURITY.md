# Security Policy for Biasbuster

## Reporting a Vulnerability

The Biasbuster team takes security vulnerabilities seriously. We appreciate your efforts to responsibly disclose your findings and will make every effort to acknowledge your contributions.

### How to Report a Vulnerability

Please report security vulnerabilities by emailing security@biasbuster.com.

Please include the following details in your report:

- A description of the vulnerability and the potential impact
- Steps to reproduce the issue
- Any relevant screenshots, logs, or other supporting material
- If known, suggested mitigations or fixes

Our security team will acknowledge receipt of your vulnerability report within 48 hours and will send a more detailed response indicating the next steps in handling your submission.

After the initial reply to your report, the security team will keep you informed of the progress toward a fix and full announcement, and may ask for additional information or guidance.

## Security Update Process

Security updates will be released as part of our regular release cycle or as emergency patches depending on severity.

### Severity Levels

- **Critical**: Vulnerabilities that can be exploited remotely, lead to privilege escalation, or expose sensitive user data
- **High**: Vulnerabilities that have significant impact but have mitigating factors
- **Medium**: Vulnerabilities that have limited impact or are difficult to exploit
- **Low**: Vulnerabilities that have minimal impact or require unlikely circumstances to exploit

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.1.x   | :white_check_mark: |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Security Measures

Biasbuster implements the following security measures:

1. **Secure Development Lifecycle**:
   - Code review requirements
   - Static code analysis
   - Dependency scanning
   - Regular security training for developers

2. **Authentication & Authorization**:
   - Strong password policies
   - Multi-factor authentication for admin users
   - Role-based access control
   - JWT token validation

3. **Data Protection**:
   - Encryption for sensitive data
   - Data minimization practices
   - Regular security assessments

4. **Infrastructure Security**:
   - Regular patching and updates
   - Network security monitoring
   - Access controls and audit logging
   - Secure configuration management

## Bug Bounty Program

Currently, Biasbuster does not operate a formal bug bounty program. However, we recognize and appreciate security researchers who report vulnerabilities responsibly. Depending on the severity and impact of the reported issue, we may offer recognition in our security acknowledgments page.

## Acknowledgments

We would like to thank the following security researchers for their responsible disclosures:

- [List will be updated as vulnerabilities are reported and resolved]

## Contact

For security-related questions or concerns, please contact security@biasbuster.com. 