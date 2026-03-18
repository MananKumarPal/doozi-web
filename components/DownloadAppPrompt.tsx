import Link from 'next/link';
import { Smartphone, ArrowRight } from 'lucide-react';

const APP_STORE_URL = 'https://testflight.apple.com/join/zqa4EvCD';
const PLAY_STORE_URL = process.env.NEXT_PUBLIC_PLAY_STORE_URL ?? APP_STORE_URL;

interface DownloadAppPromptProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export function DownloadAppPrompt({ title, description, icon }: DownloadAppPromptProps) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-gray-100">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="inline-flex items-center gap-2 text-brand-black hover:opacity-80 transition-opacity">
            <img src="/logo.svg" alt="Doozi" className="h-10 w-auto" />
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-pink/10 to-brand-purple/10 mb-8">
            {icon}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-brand-black mb-3">
            {title}
          </h1>
          <p className="text-brand-gray text-lg mb-10">
            {description}
          </p>

          <div className="space-y-4">
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-pink to-brand-purple text-white font-semibold hover:shadow-xl transition-all duration-200 shadow-lg active:scale-[0.98]"
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M12 3.73c.73-2.91 2.5-4.73 4.35-4.73.03 0 .05.01.08.01-.03 2.92-2.33 4.73-4.43 4.72" />
              </svg>
              Get it on the App Store
              <ArrowRight className="w-5 h-5 opacity-80" />
            </a>
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-4 px-6 rounded-2xl border-2 border-brand-black text-brand-black font-semibold hover:bg-brand-black hover:text-white transition-all duration-200 active:scale-[0.98]"
            >
              <svg className="w-8 h-8" viewBox="0 0 24 24" aria-hidden>
                <path fill="currentColor" d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.8 8.99l-2.302 2.302-8.634-8.634z" />
              </svg>
              Get it on Google Play
              <ArrowRight className="w-5 h-5 opacity-80" />
            </a>
          </div>

          <p className="mt-8 text-sm text-gray-500">
            No account? Sign up free at{' '}
            <Link href="/" className="text-brand-pink font-semibold hover:underline">
              doozi.app
            </Link>
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-6 text-brand-gray hover:text-brand-black transition-colors text-sm font-medium"
          >
            <Smartphone className="w-4 h-4" />
            Back to website
          </Link>
        </div>
      </main>
    </div>
  );
}
