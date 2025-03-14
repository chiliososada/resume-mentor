
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckIcon, Plus, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export const QuestionForm: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [keyword, setKeyword] = useState('');
  const [caseContent, setCaseContent] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || !answer.trim() || !keyword.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill out all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // In a real app, this would send the data to an API
    console.log({
      question,
      answer,
      category: keyword, // Map to the original category field
      caseContent: caseContent || undefined,
    });
    
    toast({
      title: "Question submitted",
      description: "Your interview question has been submitted successfully.",
    });
    
    // Reset form
    setQuestion('');
    setAnswer('');
    setKeyword('');
    setCaseContent('');
    setIsExpanded(false);
  };

  if (!isExpanded) {
    return (
      <Button
        onClick={() => setIsExpanded(true)}
        className="w-full flex items-center gap-2 animate-in"
        variant="outline"
      >
        <Plus size={16} />
        Add New Interview Question
      </Button>
    );
  }

  return (
    <Card className="glass-card animate-in overflow-hidden border border-gray-200">
      <CardContent className="p-0">
        <div className="flex justify-between items-center px-5 py-4 border-b">
          <h3 className="font-medium">Add New Interview Question</h3>
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
          <div className="space-y-1.5">
            <Label htmlFor="caseContent">Case Content</Label>
            <Textarea
              id="caseContent"
              value={caseContent}
              onChange={(e) => setCaseContent(e.target.value)}
              placeholder="Enter the case content (optional)"
            />
          </div>
        
          <div className="space-y-1.5">
            <Label htmlFor="question">Question *</Label>
            <Input
              id="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Enter the interview question"
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="answer">Answer *</Label>
            <Textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Enter the answer to the question"
              required
            />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="keyword">Keyword *</Label>
            <Input
              id="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="e.g. JavaScript, React, Leadership"
              required
            />
          </div>
          
          <div className="pt-2 flex justify-end">
            <Button type="submit">Submit Question</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
