import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SupportTicketForm } from '@/components/support/SupportTicketForm';
import { SupportTicketView } from '@/components/support/SupportTicketView';
import { SupportDashboard } from '@/components/support/SupportDashboard';

export default function Support() {
  const [activeView, setActiveView] = useState<'dashboard' | 'create' | 'view'>('dashboard');
  const [selectedTicketNumber, setSelectedTicketNumber] = useState<string>('');

  const handleCreateTicket = () => {
    setActiveView('create');
  };

  const handleViewTicket = (ticketNumber: string) => {
    setSelectedTicketNumber(ticketNumber);
    setActiveView('view');
  };

  const handleTicketCreated = (ticket: any) => {
    // Stay on the create view to show the success screen
    // The SupportTicketForm will handle showing the thank you message
    console.log('Ticket created, staying on form to show success screen:', ticket);
  };

  const handleBack = () => {
    setActiveView('dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      {activeView === 'dashboard' && (
        <SupportDashboard
          onCreateTicket={handleCreateTicket}
          onViewTicket={handleViewTicket}
          showAdminView={false}
        />
      )}
      
      {activeView === 'create' && (
        <SupportTicketForm
          onTicketCreated={handleTicketCreated}
          showKnowledgeBase={true}
        />
      )}
      
      {activeView === 'view' && selectedTicketNumber && (
        <SupportTicketView
          ticketNumber={selectedTicketNumber}
          onBack={handleBack}
        />
      )}
    </div>
  );
}