import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';

export default async function LandingPage() {
  const { userId } = await auth();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white p-4">
      <div className="text-center w-full">
       
        <div className="w-full max-w-md sm:max-w-lg md:max-w-2xl lg:max-w-3xl mx-auto bg-gray-200 rounded-lg overflow-hidden mb-8">
          <video
            className="w-full"
            src="/home_video.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
        <div className="flex justify-center gap-4 text-lg sm:text-xl">
          {userId ? (
            <Link href="/dashboard" className="hover:underline">
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/sign-in" className="hover:underline">
                Sign-in
              </Link>
              <span>|</span>
              <Link href="/sign-up" className="hover:underline">
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}