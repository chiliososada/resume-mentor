import React, { useState } from 'react';
import { ResumeCard } from '@/components/resume/ResumeCard';
import { ResumeUpload } from '@/components/resume/ResumeUpload';
import { Resume, Comment } from '@/types';
import { Button } from '@/components/ui/button';
import { Search, Filter, DownloadCloud, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ResumeViewModal } from '@/components/resume/ResumeViewModal';
import { useToast } from '@/hooks/use-toast';

const mockResumes: Resume[] = [
  {
    id: '1',
    title: 'Software Engineer Resume',
    fileName: 'software_engineer_resume.pdf',
    fileUrl: '#',
    uploadedBy: 'user1',
    uploadedAt: new Date(2023, 5, 15),
    status: 'approved',
    comments: [
      {
        id: 'c1',
        content: 'Great formatting and structure!',
        createdBy: 'teacher1',
        createdAt: new Date(2023, 5, 16),
      },
    ],
  },
  {
    id: '2',
    title: 'Data Scientist Resume',
    fileName: 'data_scientist_resume.pdf',
    fileUrl: '#',
    uploadedBy: 'user1',
    uploadedAt: new Date(2023, 5, 20),
    status: 'reviewed',
    comments: [],
  },
  {
    id: '3',
    title: 'Product Manager Resume',
    fileName: 'product_manager_resume.pdf',
    fileUrl: '#',
    uploadedBy: 'user2',
    uploadedAt: new Date(2023, 6, 1),
    status: 'pending',
    comments: [],
  },
  {
    id: '4',
    title: 'UX Designer Resume',
    fileName: 'ux_designer_resume.pdf',
    fileUrl: '#',
    uploadedBy: 'user3',
    uploadedAt: new Date(2023, 6, 5),
    status: 'pending',
    comments: [],
  },
];

const ResumePage = () => {
  const [resumes, setResumes] = useState<Resume[]>(mockResumes);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const { toast } = useToast();
  
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };
  
  const filteredResumes = resumes.filter(resume => {
    const matchesSearch = resume.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         resume.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = activeFilters.length === 0 || 
                          activeFilters.includes(resume.status);
    
    return matchesSearch && matchesFilters;
  });

  const handleViewResume = (resume: Resume) => {
    setSelectedResume(resume);
    setShowViewModal(true);
  };

  const handleStatusChange = (resumeId: string, newStatus: Resume['status']) => {
    const updatedResumes = resumes.map(resume => {
      if (resume.id === resumeId) {
        return { ...resume, status: newStatus };
      }
      return resume;
    });
    
    setResumes(updatedResumes);
    
    if (selectedResume && selectedResume.id === resumeId) {
      setSelectedResume({ ...selectedResume, status: newStatus });
    }
    
    toast({
      title: "Status updated",
      description: `Resume status has been updated to ${newStatus}.`,
    });
    
    setShowViewModal(false);
  };

  const handleAddComment = (resumeId: string, content: string) => {
    const newComment: Comment = {
      id: `c${Date.now()}`,
      content,
      createdBy: 'Current User',
      createdAt: new Date(),
    };
    
    const updatedResumes = resumes.map(resume => {
      if (resume.id === resumeId) {
        const updatedComments = resume.comments ? [...resume.comments, newComment] : [newComment];
        return { ...resume, comments: updatedComments };
      }
      return resume;
    });
    
    setResumes(updatedResumes);
    
    if (selectedResume && selectedResume.id === resumeId) {
      const updatedComments = selectedResume.comments 
        ? [...selectedResume.comments, newComment] 
        : [newComment];
      setSelectedResume({ ...selectedResume, comments: updatedComments });
    }
    
    toast({
      title: "Comment added",
      description: "Your comment has been added to the resume.",
    });
  };

  return (
    <div className="page-transition">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Resumes</h1>
            <p className="text-muted-foreground mt-1">
              Upload, manage, and review resumes
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex items-center gap-2">
              <DownloadCloud size={16} />
              Templates
            </Button>
            <Button 
              className="flex items-center gap-2"
              onClick={() => setShowUpload(!showUpload)}
            >
              {showUpload ? <X size={16} /> : <Plus size={16} />}
              {showUpload ? 'Cancel' : 'Upload Resume'}
            </Button>
          </div>
        </div>
        
        {showUpload && (
          <div className="animate-fade-in">
            <ResumeUpload />
          </div>
        )}
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search resumes..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-center">
              <Filter size={16} className="text-muted-foreground" />
              <div className="flex gap-2">
                {['pending', 'reviewed', 'approved'].map((status) => (
                  <Badge
                    key={status}
                    variant={activeFilters.includes(status) ? 'default' : 'outline'}
                    className="cursor-pointer capitalize"
                    onClick={() => toggleFilter(status)}
                  >
                    {status}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 border border-border rounded-lg p-4">
            {filteredResumes.map((resume) => (
              <ResumeCard 
                key={resume.id} 
                resume={resume} 
                onView={() => handleViewResume(resume)}
              />
            ))}
            
            {filteredResumes.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-3">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No resumes found</h3>
                <p className="text-muted-foreground mt-1 max-w-md">
                  We couldn't find any resumes matching your search criteria. Try adjusting your filters or upload a new resume.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedResume && (
        <ResumeViewModal
          resume={selectedResume}
          open={showViewModal}
          onOpenChange={setShowViewModal}
          onStatusChange={handleStatusChange}
          onAddComment={handleAddComment}
        />
      )}
    </div>
  );
};

export default ResumePage;
