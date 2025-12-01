import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ReceptionistDashboard from '@/components/receptionist/ReceptionistDashboard';

export default function ReceptionistPage() {
  return (
    <>
      <Header variant="atendente" />
      <ReceptionistDashboard />
      <Footer />
    </>
  );
}
