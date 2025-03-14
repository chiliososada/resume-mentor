
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, AlertCircle, Edit } from 'lucide-react';
import { InterviewQuestion } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface StatusBadgeProps {
  status: InterviewQuestion['status'];
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status: initialStatus }) => {
  const [status, setStatus] = React.useState<InterviewQuestion['status']>(initialStatus);
  const [editingStatus, setEditingStatus] = React.useState(false);

  const handleStatusChange = (newStatus: InterviewQuestion['status']) => {
    setStatus(newStatus);
    setEditingStatus(false);
    
    // In a real app, this would update the status via an API
    console.log(`Changing status from ${initialStatus} to ${newStatus}`);
    
    toast({
      title: "Status updated",
      description: `Question status changed to ${newStatus}`,
    });
  };

  if (editingStatus) {
    return (
      <div className="flex gap-1 items-center">
        <Badge 
          className={`cursor-pointer bg-green-50 text-green-700 border-green-200 ${status === 'approved' ? 'ring-1 ring-green-700' : ''}`}
          onClick={() => handleStatusChange('approved')}
        >
          <Check size={12} className="mr-1" />
          Approved
        </Badge>
        <Badge 
          className={`cursor-pointer bg-yellow-50 text-yellow-700 border-yellow-200 ${status === 'pending' ? 'ring-1 ring-yellow-700' : ''}`}
          onClick={() => handleStatusChange('pending')}
        >
          <AlertCircle size={12} className="mr-1" />
          Pending
        </Badge>
        <Badge 
          className={`cursor-pointer bg-red-50 text-red-700 border-red-200 ${status === 'rejected' ? 'ring-1 ring-red-700' : ''}`}
          onClick={() => handleStatusChange('rejected')}
        >
          <X size={12} className="mr-1" />
          Rejected
        </Badge>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-6 w-6 ml-1" 
          onClick={() => setEditingStatus(false)}
        >
          <X size={14} />
        </Button>
      </div>
    );
  }
  
  switch (status) {
    case 'approved':
      return (
        <div className="flex items-center gap-1">
          <Badge className="bg-green-50 text-green-700 border-green-200">Approved</Badge>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingStatus(true)}>
            <Edit size={12} />
          </Button>
        </div>
      );
    case 'rejected':
      return (
        <div className="flex items-center gap-1">
          <Badge className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingStatus(true)}>
            <Edit size={12} />
          </Button>
        </div>
      );
    default:
      return (
        <div className="flex items-center gap-1">
          <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setEditingStatus(true)}>
            <Edit size={12} />
          </Button>
        </div>
      );
  }
};
