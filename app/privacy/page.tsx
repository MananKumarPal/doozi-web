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
          <p className="text-brand-gray mb-8">Last updated: January 2026</p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-brand-gray mb-4">We collect information that you provide directly to us, including:</p>
            <ul className="list-disc list-inside text-brand-gray mb-6 space-y-2">
              <li>Account information (email, password)</li>
              <li>Profile information (username, bio, profile picture)</li>
              <li>Content you create or share (videos, comments, likes)</li>
              <li>Communications with us</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-brand-gray mb-4">We use the information we collect to:</p>
            <ul className="list-disc list-inside text-brand-gray mb-6 space-y-2">
              <li>Provide, maintain, and improve our services</li>
              <li>Process and complete transactions</li>
              <li>Send you technical notices and support messages</li>
              <li>Respond to your comments and questions</li>
              <li>Personalize your experience</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">3. Information Sharing</h2>
            <p className="text-brand-gray mb-6">
              We do not share your personal information with third parties except as described in this policy. We may share information with service providers who perform services on our behalf.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">4. Data Security</h2>
            <p className="text-brand-gray mb-6">
              We take reasonable measures to help protect your personal information from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">5. Your Rights</h2>
            <p className="text-brand-gray mb-4">You have the right to:</p>
            <ul className="list-disc list-inside text-brand-gray mb-6 space-y-2">
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to our use of your information</li>
              <li>Export your data</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">6. Cookies and Tracking</h2>
            <p className="text-brand-gray mb-6">
              We use cookies and similar tracking technologies to collect and track information about your use of our services and to improve your experience.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">7. Children's Privacy</h2>
            <p className="text-brand-gray mb-6">
              Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">8. Changes to This Policy</h2>
            <p className="text-brand-gray mb-6">
              We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">9. Contact Us</h2>
            <p className="text-brand-gray mb-6">
              If you have any questions about this Privacy Policy, please contact us at: privacy@doozi.tv
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
