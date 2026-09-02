import { ArrowLeft, FolderOpen } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[60svh] flex-col items-center justify-center py-24 text-center">
      <p className="text-accent font-mono text-sm tracking-[0.2em]">404</p>

      <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Page not found</h1>

      <p className="text-muted mt-4 max-w-md text-base leading-relaxed">
        That page does not exist, or it has moved. The links below should get you back on track.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/">
            <ArrowLeft />
            Back home
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/projects">
            <FolderOpen />
            Browse projects
          </Link>
        </Button>
      </div>
    </div>
  );
}
