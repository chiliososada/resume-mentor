import React, { useState } from 'react';
import { Resume, Comment } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  FileDown,
  Eye,
  Send,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ResumeViewModalProps {
  resume: Resume;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStatusChange: (resumeId: string, status: Resume['status']) => void;
  onAddComment?: (resumeId: string, comment: string) => void;
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
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

export const ResumeViewModal: React.FC<ResumeViewModalProps> = ({
  resume,
  open,
  onOpenChange,
  onStatusChange,
  onAddComment,
}) => {
  const [currentStatus, setCurrentStatus] = useState<Resume['status']>(resume.status);
  const [newComment, setNewComment] = useState('');

  const handleStatusChange = (newStatus: string) => {
    setCurrentStatus(newStatus as Resume['status']);
  };

  const saveChanges = () => {
    onStatusChange(resume.id, currentStatus);
  };

  const handleAddComment = () => {
    if (newComment.trim() && onAddComment) {
      onAddComment(resume.id, newComment.trim());
      setNewComment('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText size={18} /> {resume.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">File Name</span>
            <span className="text-sm text-muted-foreground">{resume.fileName}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Uploaded</span>
            <span className="text-sm text-muted-foreground">{formatDate(resume.uploadedAt)}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Current Status</span>
            <Badge className={`w-fit ${getStatusColor(resume.status)}`}>
              <span className="flex items-center gap-1">
                {getStatusIcon(resume.status)}
                {resume.status}
              </span>
            </Badge>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium">Change Status</span>
            <Select value={currentStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewed">Reviewed</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Comments</span>
            <div className="max-h-40 overflow-y-auto space-y-2 border rounded-md p-2">
              {resume.comments && resume.comments.length > 0 ? (
                resume.comments.map((comment) => (
                  <div key={comment.id} className="bg-muted/50 rounded-md p-2">
                    <div className="text-sm font-medium">{comment.createdBy}</div>
                    <div className="text-sm">{comment.content}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatDate(comment.createdAt)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No comments yet</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium">Add Comment</span>
            <div className="flex gap-2">
              <Textarea 
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px] resize-none"
              />
            </div>
            <Button 
              onClick={handleAddComment} 
              className="w-full flex items-center gap-2"
              disabled={!newComment.trim()}
            >
              <Send size={16} />
              Add Comment
            </Button>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-between gap-2">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              asChild
            >
              <a href={resume.fileUrl} target="_blank" rel="noopener noreferrer">
                <Eye size={16} />
                View
              </a>
            </Button>
            <Button 
              variant="outline" 
              className="flex items-center gap-1"
              asChild
            >
              <a href={resume.fileUrl} download={resume.fileName}>
                <FileDown size={16} />
                Download
              </a>
            </Button>
          </div>
          <Button onClick={saveChanges}>Save Status</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
