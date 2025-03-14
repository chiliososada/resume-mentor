
import React, { useState } from 'react';
import { QuestionCard } from '@/components/interview/QuestionCard';
import { QuestionForm } from '@/components/interview/QuestionForm';
import { InterviewQuestion } from '@/types';
import { Button } from '@/components/ui/button';
import { Search, Filter, Check, X, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const mockQuestions: InterviewQuestion[] = [
  {
    id: '1',
    question: 'What is the difference between var, let, and const in JavaScript?',
    answer: 'var declarations are globally scoped or function scoped while let and const are block scoped. var variables can be updated and re-declared within its scope; let variables can be updated but not re-declared; const variables can neither be updated nor re-declared. They are all hoisted to the top of their scope but while var variables are initialized with undefined, let and const variables are not initialized.',
    category: 'Technical',
    company: 'Google',
    isInternal: false,
    status: 'approved',
    createdBy: 'user1',
    createdAt: new Date(2023, 5, 15),
    comments: [
      {
        id: 'c1',
        content: 'Great explanation! Maybe add something about temporal dead zone for let and const.',
        createdBy: 'teacher1',
        createdAt: new Date(2023, 5, 16),
      },
    ],
  },
  {
    id: '2',
    question: 'Tell me about a time you had to deal with a difficult team member.',
    answer: 'I once worked with a team member who consistently missed deadlines. Instead of escalating immediately, I scheduled a private conversation to understand the challenges they were facing. They revealed they were overwhelmed with their workload. I helped them prioritize tasks and shared some time management techniques. We also agreed to have quick check-ins twice a week. Over the next month, their performance improved significantly, and we developed a much better working relationship.',
    category: 'Behavioral',
    company: 'Amazon',
    isInternal: true,
    status: 'pending',
    createdBy: 'user2',
    createdAt: new Date(2023, 6, 1),
    comments: [],
  },
  {
    id: '3',
    question: 'How would you design a URL shortening service like bit.ly?',
    answer: 'I would design a system with 1) A service to generate unique short URLs - using techniques like hashing the original URL with MD5 and taking the first 6-8 characters, or using a counter-based approach with base62 encoding. 2) A database to store mappings between short and original URLs. 3) A redirection service that looks up the original URL when a user accesses a short URL. 4) Analytics capabilities to track clicks and user engagement. The system should handle high read-to-write ratio and ensure short URLs remain unique.',
    category: 'System Design',
    company: 'Microsoft',
    isInternal: false,
    status: 'approved',
    createdBy: 'user3',
    createdAt: new Date(2023, 6, 5),
    comments: [],
  },
  {
    id: '4',
    question: 'What is a closure in JavaScript and how would you use it?',
    answer: 'A closure is the combination of a function bundled together with references to its surrounding state (the lexical environment). In other words, a closure gives you access to an outer function\'s scope from an inner function. Closures are useful for data privacy, creating function factories, and implementing the module pattern. For example, you can use closures to create private variables and methods in JavaScript.',
    category: 'Technical',
    company: 'Facebook',
    isInternal: false,
    status: 'rejected',
    createdBy: 'user4',
    createdAt: new Date(2023, 6, 10),
    comments: [
      {
        id: 'c2',
        content: 'Could you provide a code example to illustrate this concept better?',
        createdBy: 'teacher2',
        createdAt: new Date(2023, 6, 11),
      },
    ],
  },
];

const InterviewPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  
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
  
  const filteredQuestions = mockQuestions.filter(question => {
    const matchesSearch = question.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         question.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (question.company && question.company.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = categoryFilter.length === 0 || 
                           categoryFilter.includes(question.category);
    
    const matchesStatus = statusFilter.length === 0 || 
                         statusFilter.includes(question.status);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  const categories = Array.from(new Set(mockQuestions.map(q => q.category)));

  return (
    <div className="page-transition">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Interview Questions</h1>
          <p className="text-muted-foreground mt-1">
            Browse, add, and discuss interview questions
          </p>
        </div>
        
        <QuestionForm />
        
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Search questions..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
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
          </div>
          
          <div className="flex gap-2 items-center">
            <span className="text-sm text-muted-foreground">Status:</span>
            <div className="flex gap-2">
              <Badge
                variant={statusFilter.includes('approved') ? 'default' : 'outline'}
                className="cursor-pointer flex gap-1 items-center"
                onClick={() => toggleStatusFilter('approved')}
              >
                <Check size={12} />
                Approved
              </Badge>
              <Badge
                variant={statusFilter.includes('pending') ? 'default' : 'outline'}
                className="cursor-pointer flex gap-1 items-center"
                onClick={() => toggleStatusFilter('pending')}
              >
                <AlertCircle size={12} />
                Pending
              </Badge>
              <Badge
                variant={statusFilter.includes('rejected') ? 'default' : 'outline'}
                className="cursor-pointer flex gap-1 items-center"
                onClick={() => toggleStatusFilter('rejected')}
              >
                <X size={12} />
                Rejected
              </Badge>
            </div>
          </div>
          
          <div className="grid gap-4">
            {filteredQuestions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
            
            {filteredQuestions.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-muted p-3 mb-3">
                  <Search className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No questions found</h3>
                <p className="text-muted-foreground mt-1 max-w-md">
                  We couldn't find any interview questions matching your search criteria. Try adjusting your filters or add a new question.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewPage;
