import { Video } from 'lucide-react';
import type { Metadata } from 'next';
import { DownloadAppPrompt } from '@/components/DownloadAppPrompt';

const BASE_URL = 'https://www.doozi.app';

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  return {
    title: 'Watch on Doozi - Travel Discovery Made Simple',
    description: 'Download the Doozi app to watch this travel video and discover your next adventure.',
    openGraph: {
      title: 'Watch on Doozi',
      description: 'Download the Doozi app to watch this video.',
      url: `${BASE_URL}/videos/${params.id}`,
    },
  };
}

export default function VideosRedirectPage({ params }: { params: { id: string } }) {
  return (
    <DownloadAppPrompt
      title="Watch this video in the app"
      description="Download Doozi to watch travel videos, save places, and plan your trip—all in one place."
      icon={<Video className="w-10 h-10 text-brand-pink" strokeWidth={2} />}
    />
  );
}
