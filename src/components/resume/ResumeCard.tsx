
import React from 'react';
import { Resume } from '@/types';
import { FileText, Clock, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ResumeCardProps {
  resume: Resume;
  onView?: () => void;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const getStatusIcon = (status: Resume['status']) => {
  switch (status) {
    case 'approved':
      return <CheckCircle size={16} className="text-green-500" />;
    case 'reviewed':
      return <Clock size={16} className="text-blue-500" />;
    default:
      return <Clock size={16} className="text-yellow-500" />;
  }
};

const getStatusColor = (status: Resume['status']) => {
  switch (status) {
    case 'approved':
      return 'bg-green-50 text-green-700 border-green-200';
    case 'reviewed':
      return 'bg-blue-50 text-blue-700 border-blue-200';
    default:
      return 'bg-yellow-50 text-yellow-700 border-yellow-200';
  }
};

export const ResumeCard: React.FC<ResumeCardProps> = ({ resume, onView }) => {
  return (
    <Card className="hover-scale glass-card overflow-hidden animate-in border border-gray-200">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="font-medium text-lg leading-tight text-balance">{resume.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{resume.fileName}</p>
            </div>
            <Badge className={`ml-2 ${getStatusColor(resume.status)}`}>
              <span className="flex items-center gap-1">
                {getStatusIcon(resume.status)}
                {resume.status}
              </span>
            </Badge>
          </div>
          <div className="flex flex-wrap gap-y-2 items-center text-sm">
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <FileText size={14} />
              Uploaded {formatDate(resume.uploadedAt)}
            </span>
            {resume.comments && resume.comments.length > 0 && (
              <Badge variant="outline" className="ml-auto">
                {resume.comments.length} comment{resume.comments.length !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
        </div>
        <div className="flex divide-x border-t mt-1">
          <button 
            className="flex-1 py-2.5 text-center text-sm font-medium text-primary hover:bg-muted/50 transition-colors"
            onClick={onView}
          >
            View
          </button>
          <a 
            href={resume.fileUrl} 
            className="flex-1 py-2.5 text-center text-sm font-medium text-primary hover:bg-muted/50 transition-colors"
            download={resume.fileName}
          >
            Download
          </a>
        </div>
      </CardContent>
    </Card>
  );
};
