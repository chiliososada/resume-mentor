
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Comment } from '@/types';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from 'lucide-react';

interface CommentSectionProps {
  comments: Comment[];
  onAddComment?: (comment: string) => void;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

export const CommentSection: React.FC<CommentSectionProps> = ({ 
  comments, 
  onAddComment 
}) => {
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleAddComment = () => {
    if (commentText.trim() && onAddComment) {
      onAddComment(commentText);
      setCommentText('');
      setShowCommentForm(false);
    }
  };

  return (
    <>
      {comments.length > 0 && (
        <div className="mt-4 pt-4 border-t space-y-3 animate-fade-in">
          <h4 className="text-sm font-medium">Comments</h4>
          {comments.map((comment) => (
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
      
      {!showCommentForm && (
        <button
          onClick={() => setShowCommentForm(true)}
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <span className="sr-only">Add comment</span>
        </button>
      )}
    </>
  );
};
