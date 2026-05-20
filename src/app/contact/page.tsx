import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'Contact Us',
  description:
    'Get in touch with Cwmbran Celtic AFC — match enquiries, sponsorship, advertising, fan support, and general questions.',
};

export default function ContactPage() {
  return <ContactClient />;
}
