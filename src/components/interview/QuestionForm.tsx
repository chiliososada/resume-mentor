
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckIcon, Plus, X } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

export const QuestionForm: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [category, setCategory] = useState('');
  const [company, setCompany] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!question.trim() || !answer.trim() || !category.trim()) {
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
      category,
      company: company || undefined,
      isInternal,
    });
    
    toast({
      title: "Question submitted",
      description: "Your interview question has been submitted successfully.",
    });
    
    // Reset form
    setQuestion('');
    setAnswer('');
    setCategory('');
    setCompany('');
    setIsInternal(false);
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
    <Card className="glass-card animate-in overflow-hidden">
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
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. Technical, Behavioral"
                required
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="company">Company (Optional)</Label>
              <Input
                id="company"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Google, Amazon"
              />
            </div>
          </div>
          
          <label className="flex items-center space-x-2 cursor-pointer">
            <div 
              className={`w-5 h-5 border rounded flex items-center justify-center ${
                isInternal ? 'bg-primary border-primary' : 'border-input'
              }`}
              onClick={() => setIsInternal(!isInternal)}
            >
              {isInternal && <CheckIcon size={12} className="text-primary-foreground" />}
            </div>
            <span className="text-sm">This is an internal company question</span>
          </label>
          
          <div className="pt-2 flex justify-end">
            <Button type="submit">Submit Question</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
  
  function Textarea({ id, value, onChange, placeholder, required }: { 
    id: string; 
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; 
    placeholder: string;
    required?: boolean;
  }) {
    return (
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full min-h-[120px] px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
      />
    );
  }
};
