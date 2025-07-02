import type { Metadata } from 'next';
import { BookingForm } from '@/components/booking-form';

export const metadata: Metadata = {
  title: 'Book an Appointment',
  description: 'Schedule your electrical service online. Pick a service, date, and time that works for you.',
};

export default function BookingPage() {
  return <BookingForm />;
}
