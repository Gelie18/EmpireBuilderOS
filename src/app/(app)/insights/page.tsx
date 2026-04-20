import { redirect } from 'next/navigation';

// /insights replaced by the global AI Co-Pilot floating panel.
// Any direct links here go to Dashboard.
export default function InsightsRedirect() {
  redirect('/dashboard');
}
