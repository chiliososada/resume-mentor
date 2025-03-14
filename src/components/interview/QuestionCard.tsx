
import React, { useState } from 'react';
import { InterviewQuestion } from '@/types';
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { QuestionMetadata } from './QuestionMetadata';
import { CommentSection } from './CommentSection';
import { formatDate } from './utils';

interface QuestionCardProps {
  question: InterviewQuestion;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const [expanded, setExpanded] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleAddComment = (commentText: string) => {
    if (commentText.trim()) {
      // In a real app, this would send the comment to an API
      console.log('Adding comment:', commentText);
    }
  };

  return (
    <Card className="hover-scale glass-card overflow-hidden animate-in">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <QuestionMetadata 
                category={question.category} 
                company={question.company} 
                isInternal={question.isInternal} 
                status={question.status} 
              />
              <h3 className="font-medium text-lg leading-tight text-balance">{question.question}</h3>
            </div>
          </div>
          
          <div className="mb-3">
            {expanded ? (
              <div className="text-sm text-foreground animate-fade-in">
                {question.answer}
              </div>
            ) : (
              <div className="text-sm text-foreground line-clamp-2">
                {question.answer}
              </div>
            )}
          </div>
          
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Added on {formatDate(question.createdAt)}</span>
            <div className="flex gap-4">
              <button
                onClick={() => setShowCommentForm(!showCommentForm)}
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                <MessageSquare size={16} />
                {question.comments.length > 0 && question.comments.length}
              </button>
              <button
                onClick={toggleExpanded}
                className="flex items-center gap-1 hover:text-foreground transition-colors"
              >
                {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                {expanded ? 'Show less' : 'Show more'}
              </button>
            </div>
          </div>
          
          {expanded && (
            <CommentSection 
              comments={question.comments} 
              onAddComment={handleAddComment} 
            />
          )}
          
          {showCommentForm && !expanded && (
            <CommentSection 
              comments={[]} 
              onAddComment={handleAddComment} 
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
