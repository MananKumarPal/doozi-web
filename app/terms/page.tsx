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
          <p className="text-brand-gray mb-8">Last updated: January 2026</p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">1. Acceptance of Terms</h2>
            <p className="text-brand-gray mb-6">
              By accessing and using Doozi, you accept and agree to be bound by the terms and provision of this agreement.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">2. Use License</h2>
            <p className="text-brand-gray mb-6">
              Permission is granted to temporarily access and use Doozi for personal, non-commercial purposes.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">3. User Accounts</h2>
            <p className="text-brand-gray mb-6">
              When you create an account with us, you must provide information that is accurate, complete, and current at all times.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">4. Content</h2>
            <p className="text-brand-gray mb-6">
              Our platform allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">5. Prohibited Uses</h2>
            <p className="text-brand-gray mb-4">You may not use Doozi:</p>
            <ul className="list-disc list-inside text-brand-gray mb-6 space-y-2">
              <li>In any way that violates any applicable national or international law or regulation</li>
              <li>To transmit, or procure the sending of, any advertising or promotional material without our prior written consent</li>
              <li>To impersonate or attempt to impersonate the Company, a Company employee, another user, or any other person or entity</li>
              <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Service</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">6. Termination</h2>
            <p className="text-brand-gray mb-6">
              We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">7. Limitation of Liability</h2>
            <p className="text-brand-gray mb-6">
              In no event shall Doozi, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-8 mb-4">8. Contact Us</h2>
            <p className="text-brand-gray mb-6">
              If you have any questions about these Terms, please contact us at: legal@doozi.tv
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
