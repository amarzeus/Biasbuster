import React from 'react';

const PrivacyPolicyContent: React.FC = () => (
    <>
        <h4>1. Information We Collect</h4>
        <p>This is a demo application. The text you enter is sent to the Google Gemini API for analysis. We do not store your input text, analysis results, or any personal information on our servers. Your API key for Google Gemini is handled client-side and is not collected by us.</p>

        <h4>2. How We Use Information</h4>
        <p>The information sent to the Google Gemini API is used solely for the purpose of performing the bias analysis you request. We do not use this information for any other purpose, such as training models or advertising.</p>

        <h4>3. Data Security</h4>
        <p>We are committed to ensuring your information is secure. While we do not store your data, we rely on the security practices of the Google Cloud Platform for the transmission of data to the Gemini API.</p>

        <h4>4. Third-Party Services</h4>
        <p>This application uses the Google Gemini API. Your use of this service is subject to Google's own privacy policy and terms of service.</p>

        <h4>5. Changes to This Policy</h4>
        <p>We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. This policy is effective as of {new Date().getFullYear()}.</p>
    </>
);

export default PrivacyPolicyContent;