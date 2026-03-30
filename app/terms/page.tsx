import Link from 'next/link';
import { MapPin, ArrowLeft } from 'lucide-react';

export default function TermsPage() {
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
          <h1 className="text-4xl font-bold text-brand-black mb-2">Terms of Service</h1>
          <p className="text-brand-gray mb-2">End User License Agreement (EULA)</p>
          <p className="text-brand-gray mb-8">Last updated: March 2026</p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">1. Acceptance of Terms (EULA)</h2>
            <p className="text-brand-gray mb-4">
              These Terms of Service constitute a binding End User License Agreement between you and Doozi governing your use of our website, mobile applications, and related services (collectively, the &quot;Service&quot;). By creating an account, tapping &quot;I agree,&quot; or otherwise accessing or using the Service, you acknowledge that you have read, understood, and agree to be legally bound by these terms. If you do not agree, you must not use the Service.
            </p>
            <p className="text-brand-gray mb-6">
              You must be of legal age to form a binding contract in your jurisdiction to use the Service. If you use the Service on behalf of an organization, you represent that you have authority to bind that organization to these terms.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">2. No tolerance for objectionable content or abusive users</h2>
            <p className="text-brand-gray mb-4">
              Doozi maintains <strong className="text-brand-black font-semibold">zero tolerance</strong> for objectionable content and abusive behavior. We do not permit content or conduct that is unlawful, harmful, threatening, harassing, hateful, discriminatory, sexually explicit in a non-consensual or exploitative context, violent, or otherwise objectionable. We do not tolerate users who harass, bully, threaten, stalk, impersonate, or otherwise abuse others on the Service.
            </p>
            <p className="text-brand-gray mb-4">
              We may remove or restrict content, suspend or terminate accounts, and cooperate with law enforcement where appropriate, at our sole discretion and without prior notice when we believe a violation has occurred or to protect the safety and integrity of our community.
            </p>
            <p className="text-brand-gray mb-6">
              If you see content or behavior that violates these terms, please report it through the in-app reporting tools or contact us at legal@doozi.tv. We take reports seriously and will take action we consider appropriate, which may include removal of content and permanent suspension of abusive accounts.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">3. Use License</h2>
            <p className="text-brand-gray mb-6">
              Permission is granted to temporarily access and use Doozi for personal, non-commercial purposes.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">4. User Accounts</h2>
            <p className="text-brand-gray mb-6">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">5. Content and user conduct</h2>
            <p className="text-brand-gray mb-4">
              Our platform allows you to post, link, store, share, and otherwise make available information, text, graphics, videos, and other material (&quot;User Content&quot;). You are solely responsible for your User Content and your interactions with other users. You represent that you have all rights necessary to post your User Content and that it does not violate these terms or any law.
            </p>
            <p className="text-brand-gray mb-6">
              You agree not to post objectionable User Content or engage in abusive conduct as described in Section 2. We reserve the right to review, refuse, or remove any User Content for any reason, including to enforce these terms and maintain a safe environment.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">6. Prohibited uses</h2>
            <p className="text-brand-gray mb-4">You may not use Doozi:</p>
            <ul className="list-disc list-inside text-brand-gray mb-6 space-y-2">
              <li>In any way that violates any applicable national or international law or regulation</li>
              <li>To upload, post, or distribute objectionable content, including without limitation content that is defamatory, obscene, pornographic (where prohibited), promotes violence or illegal activity, or incites hatred against individuals or groups</li>
              <li>To harass, abuse, threaten, intimidate, or harm other users, or to encourage others to do so</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
              <li>To impersonate or attempt to impersonate Doozi, a Doozi employee, another user, or any other person or entity</li>
              <li>To engage in any other conduct that restricts or inhibits anyone&apos;s use or enjoyment of the Service</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">7. Termination</h2>
            <p className="text-brand-gray mb-6">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, including for breach of these terms, posting objectionable content, abusive behavior toward other users, or for any other reason at our sole discretion. Provisions that by their nature should survive termination will survive, including limitations of liability and your obligations regarding User Content you posted prior to termination.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">8. Limitation of Liability</h2>
            <p className="text-brand-gray mb-6">
              In no event shall Doozi, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">9. Contact Us</h2>
            <p className="text-brand-gray mb-6">
              If you have any questions about these Terms, please contact us at: legal@doozi.tv
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
