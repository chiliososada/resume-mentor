import React, { useState, useEffect } from 'react';
import { QuestionCard } from '@/components/interview/QuestionCard';
import { QuestionForm } from '@/components/interview/QuestionForm';
import { Button } from '@/components/ui/button';
import { Search, Filter, Check, X, AlertCircle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { questionService, Question } from '@/services/questionService';
import { toast } from '@/components/ui/use-toast';

const statusToNumber = (status: string | number): number => {
  if (typeof status === 'number') {
    return status;
  }
  
  switch (status.toLowerCase()) {
    case 'approved': return 1;
    case 'rejected': return 2;
    case 'pending':
    default: return 0;
  }
};

const InterviewPage = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [positionFilter, setPositionFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // 用于跟踪活跃的职位
  const [positions, setPositions] = useState<string[]>([]);
  
  // 从API获取并显示可用的职位名称
  const fetchPositions = async () => {
    try {
      const response = await fetch('/api/Case/positions');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setPositions(data);
        }
      }
    } catch (error) {
      console.error('获取职位列表失败:', error);
    }
  };
  
  // 组件挂载时获取职位列表
  useEffect(() => {
    fetchPositions();
  }, []);
  
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      
      const filter: Record<string, any> = {};
      
      // 搜索关键词
      if (searchQuery) {
        filter.Keyword = searchQuery;
      }
      
      // 状态过滤
      if (statusFilter.length > 0) {
        // 转换状态名称为数字
        const statusValues = statusFilter.map(status => {
          switch (status) {
            case 'approved': return 1;
            case 'rejected': return 2;
            default: return 0; // pending
          }
        });
        
        if (statusValues.length === 1) {
          filter.Status = statusValues[0];
        }
      }
      
      // 职位过滤
      if (positionFilter.length > 0 && positionFilter[0] !== '') {
        filter.Position = positionFilter.join(',');
      }
      
      // 获取问题列表
      const response = await questionService.getQuestions(
        currentPage,
        pageSize,
        'CreatedAt', // 默认按创建时间排序
        filter
      );
      
      setQuestions(response.items);
      setTotalPages(response.pageCount);
      setTotalCount(response.totalCount);
      
      // 提取并记录数据中的所有职位名称
      const extractedPositions = Array.from(
        new Set(response.items.map(q => q.position || '').filter(p => p))
      );
      
      // 更新职位列表，合并已知的和新提取的
      setPositions(prevPositions => {
        const combinedPositions = [...prevPositions, ...extractedPositions];
        return Array.from(new Set(combinedPositions)).filter(Boolean);
      });
      
    } catch (error) {
      console.error('加载问题列表失败:', error);
      toast({
        title: "加载失败",
        description: "无法加载问题列表，请稍后重试。",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  // 初始加载和刷新时获取问题
  useEffect(() => {
    fetchQuestions();
  }, [currentPage, pageSize, refreshTrigger]);
  
  // 当过滤条件改变时重置到第一页并重新加载
  useEffect(() => {
    setCurrentPage(1);
    fetchQuestions();
  }, [statusFilter, positionFilter, searchQuery]);
  
  const togglePositionFilter = (position: string) => {
    if (positionFilter.includes(position)) {
      setPositionFilter(positionFilter.filter(p => p !== position));
    } else {
      setPositionFilter([...positionFilter, position]);
    }
  };
  
  const toggleStatusFilter = (status: string) => {
    if (statusFilter.includes(status)) {
      setStatusFilter(statusFilter.filter(s => s !== status));
    } else {
      setStatusFilter([...statusFilter, status]);
    }
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuestions();
  };
  
  const refreshQuestions = () => {
    setRefreshTrigger(prev => prev + 1);
  };
  
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };
  
  // 根据问题对象构建卡片所需的数据
  const mapQuestionToCardProps = (question: Question) => {
    // 确保职位名称不为空
    const position = question.position || '';
    
    return {
      id: question.questionID.toString(),
      question: question.questionText,
      answer: question.answer || "",
      category: question.caseName || "未分类",
      company: question.companyName,
      position: position,
      isInternal: question.source === 1, // 1 = Company, 0 = Personal
      status: typeof question.status === 'number' ? question.status : statusToNumber(question.status),
      createdBy: question.username || "匿名用户",
      createdAt: new Date(question.createdAt),
      comments: [], // 评论通常需要额外请求
    };
  };

  // 过滤问题列表
  const filteredQuestions = questions.filter(question => {
    // 职位过滤
    if (positionFilter.length > 0) {
      // 如果问题没有职位信息或者职位不在过滤列表中，则不显示
      if (!question.position || !positionFilter.includes(question.position)) {
        return false;
      }
    }
    
    return true;
  });

  // 确保我们至少有一些职位数据用于显示
  const displayPositions = positions.length > 0 ? positions : ['开发', '测试', '设计', '产品经理'];

  return (
    <div className="page-transition">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">面试问题</h1>
          <p className="text-muted-foreground mt-1">
            浏览、添加和讨论面试问题
          </p>
        </div>
        
        <QuestionForm onSuccess={refreshQuestions} />
        
        <div className="flex flex-col gap-4">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="搜索问题..."
                className="pl-9"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            <Button 
              type="button" 
              variant="outline"
              onClick={refreshQuestions}
              className="sm:flex-shrink-0"
            >
              <RefreshCw size={16} className="mr-2" />
              刷新
            </Button>
          </form>
          
          {/* 职位名称过滤器 */}
          <div className="flex flex-wrap gap-2 items-center">
            <Filter size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground mr-2">职位:</span>
            <div className="flex flex-wrap gap-2">
              {displayPositions.map((position) => (
                <Badge
                  key={position}
                  variant={positionFilter.includes(position) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => togglePositionFilter(position)}
                >
                  {position || '未分类'}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">状态:</span>
            <div className="flex gap-2">
              <Badge
                variant={statusFilter.includes('approved') ? 'default' : 'outline'}
                className="cursor-pointer flex gap-1 items-center"
                onClick={() => toggleStatusFilter('approved')}
              >
                <Check size={12} />
                已批准
              </Badge>
              <Badge
                variant={statusFilter.includes('pending') ? 'default' : 'outline'}
                className="cursor-pointer flex gap-1 items-center"
                onClick={() => toggleStatusFilter('pending')}
              >
                <AlertCircle size={12} />
                待审核
              </Badge>
              <Badge
                variant={statusFilter.includes('rejected') ? 'default' : 'outline'}
                className="cursor-pointer flex gap-1 items-center"
                onClick={() => toggleStatusFilter('rejected')}
              >
                <X size={12} />
                已拒绝
              </Badge>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
            </div>
          ) : (
            <div className="grid gap-4">
              {questions.length > 0 ? (
                questions.map((question) => (
                  <QuestionCard 
                    key={question.questionID} 
                    question={mapQuestionToCardProps(question)}
                    onStatusChange={refreshQuestions}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="rounded-full bg-muted p-3 mb-3">
                    <Search className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">未找到问题</h3>
                  <p className="text-muted-foreground mt-1 max-w-md">
                    我们找不到符合搜索条件的面试问题。请尝试调整过滤条件或添加新问题。
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* 分页控件 */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {/* 生成页码按钮 */}
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                    // 显示当前页及其周围的页码
                    let pageNumber;
                    
                    if (totalPages <= 5) {
                      // 如果总页数小于等于5，直接显示所有页码
                      pageNumber = index + 1;
                    } else if (currentPage <= 3) {
                      // 如果当前页靠近开始，显示前5页
                      pageNumber = index + 1;
                    } else if (currentPage >= totalPages - 2) {
                      // 如果当前页靠近结束，显示最后5页
                      pageNumber = totalPages - 4 + index;
                    } else {
                      // 否则显示当前页及其前后各2页
                      pageNumber = currentPage - 2 + index;
                    }
                    
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          isActive={pageNumber === currentPage}
                          onClick={() => handlePageChange(pageNumber)}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
          
          <div className="text-center text-sm text-muted-foreground">
            共 {totalCount} 个问题，第 {currentPage} 页 / 共 {totalPages} 页
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;