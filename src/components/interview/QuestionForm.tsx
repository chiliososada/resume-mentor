import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CheckIcon, Plus, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { caseService } from '@/services/caseService';
import { questionService } from '@/services/questionService';

export const QuestionForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [keyword, setKeyword] = useState('');
  const [caseContent, setCaseContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [source, setSource] = useState<number>(0); // 0 = Personal, 1 = Company
  
  // 简化的案例表单状态
  const [caseName, setCaseName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [position, setPosition] = useState('');

  const resetForm = () => {
    setQuestion('');
    setAnswer('');
    setKeyword('');
    setCaseContent('');
    setCaseName('');
    setCompanyName('');
    setPosition('');
    setSource(0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim()) {
      toast({
        title: "问题不能为空",
        description: "请输入面试问题内容。",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // 首先创建或获取案例
      let caseId: number;
      
      // 创建一个新的案例
      const caseRequest = {
        caseName: caseName || `关于${keyword}的面试问题`,
        //companyName: companyName || 'ToYouSoft',
        //position: position || '开发职位',
        description: caseContent || undefined
      };
      
      const caseResponse = await caseService.createCase(caseRequest);
      caseId = caseResponse.caseId;
      
      // 创建问题
      const questionRequest = {
        caseID: caseId,
        questionText: question,
        answer: answer || "",
        source: source 
      };
      
      const response = await questionService.createQuestion(questionRequest);
      
      toast({
        title: "问题已提交",
        description: "您的面试问题已成功提交。",
      });
      
      // 重置表单
      resetForm();
      setIsExpanded(false);
      
      // 调用成功回调函数（如刷新问题列表）
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('提交问题时出错:', error);
      toast({
        title: "提交失败",
        description: "提交问题时发生错误，请重试。",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isExpanded) {
    return (
      <Button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center gap-2 animate-in"
        variant="outline"
      >
        <Plus size={16} />
        添加新面试问题
      </Button>
    );
  }

  return (
    <Card className="glass-card animate-in overflow-hidden border border-gray-200">
      <CardContent className="p-0">
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h3 className="font-medium">添加新面试问题</h3>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => setIsExpanded(false)}
          >
            <X size={16} />
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="caseName">案例名称</Label>
              <Input
                id="caseName"
                value={caseName}
                onChange={(e) => setCaseName(e.target.value)}
                placeholder="输入案例名称"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="companyName">公司名称</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="输入公司名称"
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="position">职位名称</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="输入职位名称"
              />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="caseContent">案例内容</Label>
            <Textarea
              id="caseContent"
              value={caseContent}
              onChange={(e) => setCaseContent(e.target.value)}
              placeholder="输入案例内容（可选）"
            />
          </div>
        
          <div className="space-y-1.5">
            <Label htmlFor="question">问题 *</Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="输入面试问题"
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="answer">答案 *</Label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="输入问题答案"
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="keyword">关键词 *</Label>
            <Input
              id="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="例如: JavaScript, React, 领导力"
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="source">问题来源</Label>
            <Select 
              value={source.toString()} 
              onValueChange={(value) => setSource(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择问题来源" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">个人</SelectItem>
                <SelectItem value="1">公司</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="pt-2 flex justify-end">
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full"></span>
                  提交中...
                </>
              ) : (
                <>
                  <CheckIcon size={16} />
                  提交问题
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};