import React, { useState, useEffect } from 'react';
import { ResumeCard } from '@/components/resume/ResumeCard';
import { ResumeUpload } from '@/components/resume/ResumeUpload';
import { Button } from '@/components/ui/button';
import { Search, Filter, DownloadCloud, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import ResumeViewModal from '@/components/resume/ResumeViewModal';
import { useToast } from '@/hooks/use-toast';
import { resumeService, Resume, Comment } from '@/services/resumeService';

const ResumePage = () => {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const { toast } = useToast();
  // 添加刷新标志
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // 获取简历列表
  const fetchResumes = async () => {
    try {
      setLoading(true);
      const data = await resumeService.getResumes();

      // 处理日期字段 - 将所有日期字符串转为Date对象
      const processedData = data.map(resume => ({
        ...resume,
        uploadedAt: new Date(resume.uploadedAt + 'Z'), // 添加Z以确保UTC时间
        comments: resume.comments ? resume.comments.map(comment => ({
          ...comment,
          createdAt: new Date(comment.createdAt + 'Z')
        })) : []
      }));

      setResumes(processedData);
    } catch (error) {
      console.error('获取简历列表失败:', error);
      toast({
        title: "获取失败",
        description: "无法获取简历列表，请稍后重试。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // 组件挂载时获取数据和刷新标志变化时重新获取数据
  useEffect(() => {
    fetchResumes();
  }, [refreshTrigger]);

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

  // 修改handleStatusChange函数，通过两种方式更新状态
  const handleStatusChange = (resumeId: string, newStatus: Resume['status']) => {
    // 1. 更新本地状态
    const updatedResumes = resumes.map(resume => {
      if (resume.id === resumeId) {
        return { ...resume, status: newStatus };
      }
      return resume;
    });

    // 更新本地状态
    setResumes(updatedResumes);

    // 更新选中的简历状态
    if (selectedResume && selectedResume.id === resumeId) {
      setSelectedResume({ ...selectedResume, status: newStatus });
    }

    // 显示成功消息
    toast({
      title: "状态已更新",
      description: `简历状态已更新为${newStatus === 'approved' ? '已批准' :
        newStatus === 'reviewed' ? '已审阅' : '待审核'
        }。`,
    });

    // 2. 触发刷新，从服务器重新获取最新数据
    setRefreshTrigger(prev => prev + 1);

    // 关闭模态框
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
      title: "评论已添加",
      description: "您的评论已添加到简历。",
    });

    // 触发刷新
    setRefreshTrigger(prev => prev + 1);
  };

  const handleDownloadTemplate = async () => {
    try {
      // 从fileUrl中提取GUID文件名
      const fileName = "resume_template.xlsx";

      // 使用FileController的下载端点
      const response = await fetch(`/api/File/templates/${fileName}`);

      if (!response.ok) {
        throw new Error('下载失败');
      }

      // 获取文件数据并创建Blob
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // 创建下载链接并触发下载
      const a = document.createElement('a');
      a.href = url;
      a.download = "resume_template.xlsx"; // 使用原始文件名
      document.body.appendChild(a);
      a.click();

      // 清理
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }

    catch (error) {
      console.error('获取模板失败:', error);
      toast({
        title: "获取模板失败",
        description: "无法获取简历模板，请稍后重试。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-transition">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">简历</h1>
            <p className="text-muted-foreground mt-1">
              上传、管理和审阅简历
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={handleDownloadTemplate}
            >
              <DownloadCloud size={16} />
              模板
            </Button>
            <Button
              className="flex items-center gap-2"
              onClick={() => setShowUpload(!showUpload)}
            >
              {showUpload ? <X size={16} /> : <Plus size={16} />}
              {showUpload ? '取消' : '上传简历'}
            </Button>
          </div>
        </div>

        {showUpload && (
          <div className="animate-fade-in">
            <ResumeUpload onUploadSuccess={() => setRefreshTrigger(prev => prev + 1)} />
          </div>
        )}

        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="搜索简历..."
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
                    {{
                      'pending': '待审核',
                      'reviewed': '已审阅',
                      'approved': '已批准'
                    }[status]}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 border border-border rounded-lg p-4">
            {loading ? (
              <div className="col-span-full flex justify-center p-8">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
              </div>
            ) : (
              <>
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
                    <h3 className="text-lg font-medium">没有找到简历</h3>
                    <p className="text-muted-foreground mt-1 max-w-md">
                      未找到匹配的简历。尝试调整过滤条件或上传新的简历。
                    </p>
                  </div>
                )}
              </>
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