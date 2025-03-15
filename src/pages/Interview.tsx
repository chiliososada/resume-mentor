import React, { useState, useEffect } from 'react';
import { QuestionCard } from '@/components/interview/QuestionCard';
import { QuestionForm } from '@/components/interview/QuestionForm';
import { Button } from '@/components/ui/button';
import { Search, Filter, Check, X, AlertCircle, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // 用于跟踪活跃的分类
  const [categories, setCategories] = useState<string[]>([]);
  
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
      
      // 提取并记录所有分类（使用关键词作为分类）
      const extractedCategories = Array.from(
        new Set(response.items.map(q => q.caseName || '未分类'))
      );
      setCategories(prev => {
        const uniqueCategories = Array.from(new Set([...prev, ...extractedCategories]));
        return uniqueCategories.filter(c => c);
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
  }, [statusFilter, categoryFilter, searchQuery]);
  
  const toggleCategoryFilter = (category: string) => {
    if (categoryFilter.includes(category)) {
      setCategoryFilter(categoryFilter.filter(c => c !== category));
    } else {
      setCategoryFilter([...categoryFilter, category]);
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
  
  // 获取状态显示文本
  const getStatusText = (status: number): string => {
    switch (status) {
      case 1: return '已批准';
      case 2: return '已拒绝';
      case 0:
      default: return '待审核';
    }
  };
  
  // 根据问题对象构建卡片所需的数据
  const mapQuestionToCardProps = (question: Question) => {
    return {
      id: question.questionID.toString(),
      question: question.questionText,
      answer: question.answer || "",
      category: question.caseName || "未分类",
      company: question.companyName,
      isInternal: question.source === 1, // 1 = Company, 0 = Personal
      status: typeof question.status === 'number' ? question.status : statusToNumber(question.status),
      createdBy: question.username || "匿名用户",
      createdAt: new Date(question.createdAt),
      comments: [], // 评论通常需要额外请求
    };
  };

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
          
          <div className="flex flex-wrap gap-2 items-center">
            <Filter size={16} className="text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Badge
                  key={category}
                  variant={categoryFilter.includes(category) ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => toggleCategoryFilter(category)}
                >
                  {category}
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