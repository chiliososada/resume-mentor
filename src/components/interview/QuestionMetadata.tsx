import React from 'react';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from './StatusBadge';

interface QuestionMetadataProps {
  category: string;
  company?: string;
  isInternal: boolean;
  status: number; // 修改为数字类型
  questionId: number;
  onStatusChange?: () => void;
}

export const QuestionMetadata: React.FC<QuestionMetadataProps> = ({
  category,
  company,
  isInternal,
  status,
  questionId,
  onStatusChange
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-2">
      <Badge variant="outline">{category}</Badge>
      {company && (
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          {company}
        </Badge>
      )}
      {isInternal && (
        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
          公司内部
        </Badge>
      )}
      <div className="ml-auto">
        <StatusBadge 
          status={status} 
          questionId={questionId}
          onStatusChange={onStatusChange}
        />
      </div>
    </div>
  );
};