import { User } from 'lucide-react';
import type { Metadata } from 'next';
import { DownloadAppPrompt } from '@/components/DownloadAppPrompt';

const BASE_URL = 'https://www.doozi.app';

export async function generateMetadata({ params }: { params: { usernameOrId: string } }): Promise<Metadata> {
  return {
    title: 'View profile on Doozi - Travel Discovery Made Simple',
    description: 'Download the Doozi app to view this traveller\'s profile and discover their recommendations.',
    openGraph: {
      title: 'View profile on Doozi',
      description: 'Download the Doozi app to view this profile.',
      url: `${BASE_URL}/users/${params.usernameOrId}`,
    },
  };
}

export default function UserRedirectPage({ params }: { params: { usernameOrId: string } }) {
  return (
    <DownloadAppPrompt
      title="View this profile in the app"
      description="Download Doozi to see this traveller's saved places, videos, and itineraries—and plan your next trip."
      icon={<User className="w-10 h-10 text-brand-pink" strokeWidth={2} />}
    />
  );
}
