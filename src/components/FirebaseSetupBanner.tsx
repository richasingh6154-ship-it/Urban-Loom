import { useState } from 'react';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';

interface FirebaseSetupBannerProps {
  context?: string;
}

export function FirebaseSetupBanner({ context }: FirebaseSetupBannerProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-[#EFECE6] border border-[#D8D1C5] rounded-md p-4 space-y-2.5 text-xs text-[#1A1917]">
      <div className="flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#6E4F3A] shrink-0 mt-0.5" />
        <div className="flex-1 space-y-1">
          <p className="font-semibold">
            Firebase Authentication Not Configured
          </p>
          <p className="text-[#635E56] leading-relaxed">
            {context ||
              'Firebase provisioning was declined for this workspace. Live Email/Password accounts, Google Sign-In, password reset emails, and Firestore user profiles are inactive until Firebase is connected.'}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        className="inline-flex items-center gap-1.5 font-medium text-[#4B5842] hover:underline"
      >
        <span>{expanded ? 'Hide setup instructions' : 'View Firebase setup instructions'}</span>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {expanded && (
        <ol className="list-decimal list-inside space-y-1.5 pt-2 border-t border-[#D8D1C5] text-[#635E56] leading-relaxed">
          <li>
            Provision a Firebase project with <strong className="text-[#1A1917]">Firestore</strong>{' '}
            and <strong className="text-[#1A1917]">Firebase Authentication</strong> enabled.
          </li>
          <li>
            In <strong className="text-[#1A1917]">Firebase Console → Authentication → Sign-in method</strong>,
            enable <strong className="text-[#1A1917]">Email/Password</strong> and{' '}
            <strong className="text-[#1A1917]">Google</strong> providers, and add your app domain
            to Authorized Domains.
          </li>
          <li>
            Add your web app config in <code className="font-mono text-[11px]">firebase-applet-config.json</code>{' '}
            and deploy <code className="font-mono text-[11px]">firestore.rules</code> restricting
            profiles, wishlists, saved addresses, and orders to <code className="font-mono text-[11px]">request.auth.uid</code>.
          </li>
        </ol>
      )}
    </div>
  );
}
