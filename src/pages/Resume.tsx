
import React, { useState } from 'react';
import { ResumeCard } from '@/components/resume/ResumeCard';
import { ResumeUpload } from '@/components/resume/ResumeUpload';
import { Resume } from '@/types';
import { Button } from '@/components/ui/button';
import { Search, Filter, DownloadCloud, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  
  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };
  
  const filteredResumes = mockResumes.filter(resume => {
    const matchesSearch = resume.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         resume.fileName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilters = activeFilters.length === 0 || 
                          activeFilters.includes(resume.status);
    
    return matchesSearch && matchesFilters;
  });

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
          
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResumes.map((resume) => (
              <ResumeCard key={resume.id} resume={resume} />
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
    </div>
  );
};

export default ResumePage;
