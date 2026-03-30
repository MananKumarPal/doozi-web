import Link from 'next/link';
import { MapPin, ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center space-x-2">
              <MapPin className="h-7 w-7 text-brand-pink" />
              <span className="text-2xl font-bold text-brand-black">Doozi</span>
            </Link>
            <Link href="/" className="flex items-center space-x-2 text-sm text-brand-gray hover:text-brand-pink transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-card p-8 md:p-12">
          <h1 className="text-4xl font-bold text-brand-black mb-2">Privacy Policy</h1>
          <p className="text-brand-gray mb-4">Last updated: March 2026</p>
          <p className="text-brand-gray mb-8">
            This policy describes how Doozi (&quot;Doozi,&quot; &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) collects, uses, discloses, and protects personal information when you use our websites, mobile applications, and related services (the &quot;Service&quot;). If you do not agree with this policy, please do not use the Service.
          </p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">Agreement with our Terms of Service</h2>
            <p className="text-brand-gray mb-6">
              Use of Doozi is governed by our{' '}
              <Link href="/terms" className="text-brand-pink hover:underline">
                Terms of Service (End User License Agreement)
              </Link>
              , which you must accept to use the Service. Those terms state that there is no tolerance for objectionable content or abusive users, and describe how we may enforce our policies.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">1. Information we collect</h2>
            <h3 className="text-xl font-semibold text-brand-black mt-6 mb-3">Information you provide</h3>
            <ul className="list-disc list-inside text-brand-gray mb-6 space-y-2">
              <li>Account information (such as email and credentials)</li>
              <li>Profile information (such as username, bio, and profile picture)</li>
              <li>Content you create or share (such as videos, comments, likes, and messages)</li>
              <li>Communications with us (such as support requests and feedback)</li>
            </ul>
            <h3 className="text-xl font-semibold text-brand-black mt-6 mb-3">Information collected automatically</h3>
            <p className="text-brand-gray mb-4">
              When you use the Service, we automatically collect certain information, which may include:
            </p>
            <ul className="list-disc list-inside text-brand-gray mb-6 space-y-2">
              <li>Device and app information (such as device type, operating system, app version, language, and identifiers we or our service providers assign to your device or browser)</li>
              <li>Log and usage data (such as IP address, access times, pages or screens viewed, features used, and referring URLs)</li>
              <li>Approximate location derived from IP address, and, if you allow it in your device settings, more precise location when you use location-enabled features</li>
            </ul>
            <h3 className="text-xl font-semibold text-brand-black mt-6 mb-3">Information from your device (permissions)</h3>
            <p className="text-brand-gray mb-4">
              Depending on how you use the Service and what you choose to allow, we may access information made available through your device permissions, such as your camera, microphone, photo library or camera roll, contacts (if you choose to use a contacts-based feature), and location. If you enable notifications, we receive a push token or similar identifier so we can deliver notifications to your device. You can change permissions and notification preferences in your device settings at any time. If you deny access, some features may not work as intended.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">2. How we use your information</h2>
            <p className="text-brand-gray mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-brand-gray mb-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and complete transactions</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Personalize your experience</li>
              <li>Detect, investigate, and address abuse, fraud, illegal activity, and violations of our Terms of Service, including reviewing reported content and account activity where necessary to protect users and the Service</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">3. How we share information</h2>
            <p className="text-brand-gray mb-4">
              We do not sell your personal information for money. We may share information in the following circumstances:
            </p>
            <ul className="list-disc list-inside text-brand-gray mb-6 space-y-2">
              <li>
                <strong className="text-brand-black font-semibold">Service providers.</strong> We share information with vendors and partners who help us operate the Service (for example, hosting, data storage, analytics, customer support tools, email delivery, security, and fraud prevention). They may process information only as instructed by us and subject to appropriate safeguards.
              </li>
              <li>
                <strong className="text-brand-black font-semibold">Apple and payment processors.</strong> Purchases and subscriptions made through our iOS app may be processed by Apple. Apple receives information needed to complete the transaction under Apple&apos;s terms and privacy policy. We receive limited purchase-related information from Apple (such as confirmation of subscription status) and do not receive your full payment card number from Apple for those transactions.
              </li>
              <li>
                <strong className="text-brand-black font-semibold">Legal and safety.</strong> We may disclose information if we believe it is necessary to comply with law, regulation, legal process, or governmental request; to enforce our terms or policies; to protect the rights, property, or safety of Doozi, our users, or others; or to detect, prevent, or address fraud, security, or technical issues.
              </li>
              <li>
                <strong className="text-brand-black font-semibold">Business transfers.</strong> If we are involved in a merger, acquisition, financing, or sale of assets, your information may be transferred as part of that transaction, subject to appropriate confidentiality and this policy (or equivalent protections).
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">4. Data security</h2>
            <p className="text-brand-gray mb-6">
              We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">5. Your rights</h2>
            <p className="text-brand-gray mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-brand-gray mb-6 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to our use of your information</li>
              <li>Export your data</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">6. Cookies, analytics, and advertising</h2>
            <p className="text-brand-gray mb-4">
              On our websites and, where applicable, in our apps, we use cookies, pixels, SDKs, and similar technologies to remember preferences, understand how the Service is used, and improve performance and security.
            </p>
            <p className="text-brand-gray mb-4">
              If we or our partners use your information to track you across apps and websites owned by other companies for targeted advertising or analytics that Apple classifies as tracking, we will request your permission on supported iOS versions through Apple&apos;s App Tracking Transparency (ATT) framework where required. You can change your choice later in your device settings.
            </p>
            <p className="text-brand-gray mb-6">
              Your device and browser may offer controls to limit cookies and similar technologies; blocking them may affect certain features.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">7. Children&apos;s privacy</h2>
            <p className="text-brand-gray mb-6">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">8. Data retention</h2>
            <p className="text-brand-gray mb-6">
              We retain personal information for as long as necessary to provide the Service, comply with legal obligations, resolve disputes, and enforce our agreements. Retention periods vary depending on the type of information and how we use it. When we no longer need information, we will delete or de-identify it in accordance with our practices and applicable law.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">9. International data transfers</h2>
            <p className="text-brand-gray mb-6">
              We may process and store information in the United States and other countries where we or our service providers operate. Those countries may have data protection laws that differ from those where you live. Where required, we use appropriate safeguards (such as contractual clauses approved by regulators) for transfers of personal information.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">10. California privacy rights</h2>
            <p className="text-brand-gray mb-4">
              If you are a California resident, the California Consumer Privacy Act (CCPA), as amended, may provide you with additional rights regarding personal information, including:
            </p>
            <ul className="list-disc list-inside text-brand-gray mb-4 space-y-2">
              <li>The right to know what personal information we collect, use, disclose, and sell or share (we do not sell personal information for monetary consideration as defined by the CCPA)</li>
              <li>The right to request deletion of personal information, subject to certain exceptions</li>
              <li>The right to correct inaccurate personal information</li>
              <li>The right to opt out of certain types of &quot;selling&quot; or &quot;sharing&quot; for cross-context behavioral advertising, where applicable</li>
              <li>The right not to receive discriminatory treatment for exercising privacy rights</li>
            </ul>
            <p className="text-brand-gray mb-6">
              To exercise these rights, contact us at hello@doozi. We may verify your request before responding. You may designate an authorized agent to make a request on your behalf where permitted by law.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">11. European Economic Area, United Kingdom, and Switzerland</h2>
            <p className="text-brand-gray mb-4">
              If you are located in the EEA, UK, or Switzerland, our processing of your personal information may be based on one or more legal grounds under applicable law, such as performance of a contract with you, our legitimate interests (where not overridden by your rights), compliance with legal obligations, or your consent where required.
            </p>
            <p className="text-brand-gray mb-4">
              You may have the right to access, rectify, erase, restrict, or object to certain processing, and to data portability, in each case subject to applicable law. You may also lodge a complaint with a data protection authority in your country or region.
            </p>
            <p className="text-brand-gray mb-6">
              To exercise these rights, contact us at hello@doozi.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">12. Changes to this policy</h2>
            <p className="text-brand-gray mb-6">
              We may update this privacy policy from time to time. We will post the updated policy on this page and update the &quot;Last updated&quot; date. If changes are material, we will provide additional notice as required by law (for example, through the Service or by email).
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">13. Contact us</h2>
            <p className="text-brand-gray mb-6">
              If you have any questions about this Privacy Policy, please contact us at: hello@doozi
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
