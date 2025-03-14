
import React, { useState } from 'react';
import { InterviewQuestion } from '@/types';
import { MessageSquare, ChevronDown, ChevronUp, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface QuestionCardProps {
  question: InterviewQuestion;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const [expanded, setExpanded] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      // In a real app, this would send the comment to an API
      console.log('Adding comment:', commentText);
      setCommentText('');
      setShowCommentForm(false);
    }
  };

  const getStatusBadge = (status: InterviewQuestion['status']) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
    }
  };

  return (
    <Card className="hover-scale glass-card overflow-hidden animate-in">
      <CardContent className="p-0">
        <div className="p-5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <div className="flex gap-2 mb-2">
                <Badge variant="outline">{question.category}</Badge>
                {question.company && (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {question.company}
                  </Badge>
                )}
                {question.isInternal && (
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    Internal
                  </Badge>
                )}
                <div className="ml-auto">{getStatusBadge(question.status)}</div>
              </div>
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
          
          {(expanded && question.comments.length > 0) && (
            <div className="mt-4 pt-4 border-t space-y-3 animate-fade-in">
              <h4 className="text-sm font-medium">Comments</h4>
              {question.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-muted text-xs">
                      <User size={14} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm">{comment.content}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {showCommentForm && (
            <div className="mt-4 pt-4 border-t animate-fade-in">
              <Textarea
                placeholder="Add your comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="mb-3 min-h-[80px] w-full"
              />
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowCommentForm(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                >
                  Add Comment
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
  
  function Textarea({ placeholder, value, onChange, className }: { placeholder: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; className: string }) {
    return (
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full min-h-[80px] px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary ${className}`}
      />
    );
  }
};
