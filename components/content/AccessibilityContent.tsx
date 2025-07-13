import React from 'react';

const AccessibilityContent: React.FC = () => (
    <>
        <p>Biasbuster is committed to ensuring digital accessibility for people with disabilities. We are continually improving the user experience for everyone and applying the relevant accessibility standards.</p>

        <h4>Conformance Status</h4>
        <p>The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. We aim for WCAG 2.1 Level AA conformance.</p>
        
        <h4>Key Accessibility Features</h4>
        <ul>
            <li><strong>Keyboard Navigation:</strong> The entire application can be navigated using a keyboard.</li>
            <li><strong>Semantic HTML:</strong> We use semantic HTML5 elements to ensure content is well-structured and understandable by screen readers.</li>
            <li><strong>ARIA Attributes:</strong> We use ARIA (Accessible Rich Internet Applications) attributes to enhance the accessibility of dynamic content and advanced user interface controls.</li>
            <li><strong>Color Contrast:</strong> Text and background colors have been chosen to meet contrast requirements.</li>
            <li><strong>Dark Mode:</strong> A user-selectable dark mode is available for visual comfort.</li>
        </ul>

        <h4>Feedback</h4>
        <p>We welcome your feedback on the accessibility of Biasbuster. Please let us know if you encounter accessibility barriers by emailing the creator. We try to respond to feedback within 5 business days.</p>
    </>
);

export default AccessibilityContent;