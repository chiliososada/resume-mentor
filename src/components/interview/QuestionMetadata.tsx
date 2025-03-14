
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from './StatusBadge';

interface QuestionMetadataProps {
  category: string;
  company?: string;
  isInternal: boolean;
  status: 'pending' | 'approved' | 'rejected';
}

export const QuestionMetadata: React.FC<QuestionMetadataProps> = ({
  category,
  company,
  isInternal,
  status,
}) => {
  return (
    <div className="flex gap-2 mb-2">
      <Badge variant="outline">{category}</Badge>
      {company && (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {company}
        </Badge>
      )}
      {isInternal && (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          Internal
        </Badge>
      )}
      <div className="ml-auto">
        <StatusBadge status={status} />
      </div>
    </div>
  );
};
