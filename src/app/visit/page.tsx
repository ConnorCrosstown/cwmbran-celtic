import { redirect } from 'next/navigation';

// Redirect old /visit URL to consolidated /matchday page
export default function VisitUsPage() {
  redirect('/matchday');
}
