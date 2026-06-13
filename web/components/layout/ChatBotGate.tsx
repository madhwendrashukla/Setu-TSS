'use client';

import { usePathname } from 'next/navigation';
import DirectoryAdvisorBot from '@/components/ecosystem/DirectoryAdvisorBot';

// Pages where the default DirectoryAdvisorBot should NOT be shown
const EXCLUDED_PATHS = ['/fundraising-workshop-15apr', '/AI-workshop-15may', '/ON15MAY-AI-SUCCESS', '/ON15AprFund-Av', '/ON15AprFund-B'];

export default function ChatBotGate() {
  const pathname = usePathname();

  if (EXCLUDED_PATHS.includes(pathname) || pathname.startsWith('/tools') || pathname.startsWith('/admin')) return null;

  return <DirectoryAdvisorBot isHome={pathname === '/'} />;
}
