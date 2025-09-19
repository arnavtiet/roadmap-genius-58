/* eslint-disable @typescript-eslint/no-explicit-any */

interface CourseNode {
  id: string;
  title: string;
  description: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress?: number;
  children?: CourseNode[];
}

const courseTemplates: Record<string, CourseNode> = {
  'web development': {
    id: 'web-dev-root',
    title: 'Full Stack Web Development',
    description: 'Complete roadmap to become a full-stack web developer',
    duration: '6-12 months',
    difficulty: 'Beginner',
    children: [
      {
        id: 'html-css',
        title: 'HTML & CSS Fundamentals',
        description: 'Learn the building blocks of web pages',
        duration: '2-3 weeks',
        difficulty: 'Beginner',
        progress: 0,
        children: [
          {
            id: 'html-basics',
            title: 'HTML Basics',
            description: 'HTML tags, elements, and structure',
            duration: '1 week',
            difficulty: 'Beginner',
            children: []
          },
          {
            id: 'css-styling',
            title: 'CSS Styling',
            description: 'Selectors, properties, and layouts',
            duration: '1 week',
            difficulty: 'Beginner',
            children: []
          },
          {
            id: 'responsive-design',
            title: 'Responsive Design',
            description: 'Media queries and mobile-first approach',
            duration: '1 week',
            difficulty: 'Intermediate',
            children: []
          }
        ]
      },
      {
        id: 'javascript',
        title: 'JavaScript Programming',
        description: 'Master the language of the web',
        duration: '4-6 weeks',
        difficulty: 'Intermediate',
        progress: 0,
        children: [
          {
            id: 'js-fundamentals',
            title: 'JavaScript Fundamentals',
            description: 'Variables, functions, and control structures',
            duration: '2 weeks',
            difficulty: 'Beginner',
            children: []
          },
          {
            id: 'dom-manipulation',
            title: 'DOM Manipulation',
            description: 'Interact with web page elements',
            duration: '1 week',
            difficulty: 'Intermediate',
            children: []
          },
          {
            id: 'async-programming',
            title: 'Asynchronous Programming',
            description: 'Promises, async/await, and APIs',
            duration: '2 weeks',
            difficulty: 'Intermediate',
            children: []
          }
        ]
      },
      {
        id: 'frontend-frameworks',
        title: 'Frontend Frameworks',
        description: 'Modern JavaScript frameworks',
        duration: '6-8 weeks',
        difficulty: 'Intermediate',
        progress: 0,
        children: [
          {
            id: 'react',
            title: 'React.js',
            description: 'Component-based UI library',
            duration: '4 weeks',
            difficulty: 'Intermediate',
            children: [
              {
                id: 'react-basics',
                title: 'React Basics',
                description: 'Components, props, and state',
                duration: '1 week',
              difficulty: 'Intermediate',
                children: []
              },
              {
                id: 'react-hooks',
                title: 'React Hooks',
                description: 'useState, useEffect, and custom hooks',
                duration: '1 week',
              difficulty: 'Intermediate',
                children: []
              }
            ]
          },
          {
            id: 'state-management',
            title: 'State Management',
            description: 'Redux, Context API, and Zustand',
            duration: '2 weeks',
            difficulty: 'Advanced',
            children: []
          }
        ]
      },
      {
        id: 'backend',
        title: 'Backend Development',
        description: 'Server-side programming and databases',
        duration: '8-10 weeks',
        difficulty: 'Intermediate',
        progress: 0,
        children: [
          {
            id: 'nodejs',
            title: 'Node.js',
            description: 'JavaScript runtime for servers',
            duration: '3 weeks',
            difficulty: 'Intermediate',
            children: []
          },
          {
            id: 'databases',
            title: 'Databases',
            description: 'SQL and NoSQL databases',
            duration: '3 weeks',
            difficulty: 'Intermediate',
            children: []
          },
          {
            id: 'apis',
            title: 'RESTful APIs',
            description: 'Create and consume web APIs',
            duration: '2 weeks',
            difficulty: 'Intermediate',
            children: []
          }
        ]
      }
    ]
  },
  'data science': {
    id: 'data-science-root',
    title: 'Data Science Mastery',
    description: 'Complete path to becoming a data scientist',
    duration: '8-12 months',
    difficulty: 'Intermediate',
    children: [
      {
        id: 'python-basics',
        title: 'Python Programming',
        description: 'Learn Python for data science',
        duration: '4-6 weeks',
        difficulty: 'Beginner',
        children: [
          {
            id: 'python-syntax',
            title: 'Python Syntax',
            description: 'Variables, data types, and control flow',
            duration: '2 weeks',
            difficulty: 'Beginner',
            children: []
          },
          {
            id: 'python-libraries',
            title: 'Python Libraries',
            description: 'NumPy, Pandas, and Matplotlib',
            duration: '2 weeks',
            difficulty: 'Intermediate',
            children: []
          }
        ]
      },
      {
        id: 'statistics',
        title: 'Statistics & Probability',
        description: 'Mathematical foundations for data science',
        duration: '6-8 weeks',
        difficulty: 'Intermediate',
        children: [
          {
            id: 'descriptive-stats',
            title: 'Descriptive Statistics',
            description: 'Mean, median, mode, and distributions',
            duration: '2 weeks',
            difficulty: 'Beginner',
            children: []
          },
          {
            id: 'inferential-stats',
            title: 'Inferential Statistics',
            description: 'Hypothesis testing and confidence intervals',
            duration: '3 weeks',
            difficulty: 'Intermediate',
            children: []
          }
        ]
      },
      {
        id: 'machine-learning',
        title: 'Machine Learning',
        description: 'Algorithms and model building',
        duration: '10-12 weeks',
        difficulty: 'Advanced',
        children: [
          {
            id: 'supervised-learning',
            title: 'Supervised Learning',
            description: 'Classification and regression algorithms',
            duration: '4 weeks',
            difficulty: 'Advanced',
            children: []
          },
          {
            id: 'unsupervised-learning',
            title: 'Unsupervised Learning',
            description: 'Clustering and dimensionality reduction',
            duration: '3 weeks',
            difficulty: 'Advanced',
            children: []
          },
          {
            id: 'deep-learning',
            title: 'Deep Learning',
            description: 'Neural networks and deep learning frameworks',
            duration: '4 weeks',
            difficulty: 'Advanced',
            children: []
          }
        ]
      }
    ]
  },
  'mobile development': {
    id: 'mobile-dev-root',
    title: 'Mobile App Development',
    description: 'Build native and cross-platform mobile apps',
    duration: '6-10 months',
    difficulty: 'Intermediate',
    children: [
      {
        id: 'mobile-fundamentals',
        title: 'Mobile Development Fundamentals',
        description: 'Understanding mobile platforms and design principles',
        duration: '2-3 weeks',
        difficulty: 'Beginner',
        children: [
          {
            id: 'mobile-design',
            title: 'Mobile UI/UX Design',
            description: 'Design principles for mobile interfaces',
            duration: '1 week',
            difficulty: 'Beginner',
            children: []
          },
          {
            id: 'platform-overview',
            title: 'Platform Overview',
            description: 'iOS vs Android development approaches',
            duration: '1 week',
            difficulty: 'Beginner',
            children: []
          }
        ]
      },
      {
        id: 'react-native',
        title: 'React Native',
        description: 'Cross-platform mobile development',
        duration: '8-10 weeks',
        difficulty: 'Intermediate',
        children: [
          {
            id: 'rn-setup',
            title: 'React Native Setup',
            description: 'Environment setup and first app',
            duration: '1 week',
            difficulty: 'Intermediate',
            children: []
          },
          {
            id: 'rn-navigation',
            title: 'Navigation',
            description: 'React Navigation and routing',
            duration: '2 weeks',
            difficulty: 'Intermediate',
            children: []
          },
          {
            id: 'native-features',
            title: 'Native Features',
            description: 'Camera, GPS, and device APIs',
            duration: '3 weeks',
            difficulty: 'Advanced',
            children: []
          }
        ]
      }
    ]
  }
};

export const generateCourseRoadmap = (prompt: string): CourseNode => {
  const lowerPrompt = prompt.toLowerCase();
  
  // Simple keyword matching - in a real app, this would be handled by AI/NLP
  let selectedTemplate = courseTemplates['web development']; // default
  
  if (lowerPrompt.includes('data') || lowerPrompt.includes('science') || lowerPrompt.includes('machine learning')) {
    selectedTemplate = courseTemplates['data science'];
  } else if (lowerPrompt.includes('mobile') || lowerPrompt.includes('app') || lowerPrompt.includes('react native')) {
    selectedTemplate = courseTemplates['mobile development'];
  } else if (lowerPrompt.includes('web') || lowerPrompt.includes('frontend') || lowerPrompt.includes('backend')) {
    selectedTemplate = courseTemplates['web development'];
  }

  // Add unique IDs to all nodes
  const addIds = (node: any, prefix = ''): CourseNode => {
    const id = node.id || `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      ...node,
      id,
      children: node.children?.map((child: any, index: number) => 
        addIds(child, `${id}-child-${index}`)
      ) || []
    };
  };

  return addIds(selectedTemplate, 'root');
};

// Future API integration structure
export interface CourseRoadmapAPI {
  generateRoadmap: (prompt: string, userId?: string) => Promise<CourseNode>;
  saveProgress: (nodeId: string, progress: number, userId: string) => Promise<void>;
  getUserProgress: (userId: string) => Promise<Record<string, number>>;
  updateNodeCompletion: (nodeId: string, completed: boolean, userId: string) => Promise<void>;
}

// Placeholder for future backend integration
export const courseAPI: CourseRoadmapAPI = {
  generateRoadmap: async (prompt: string, userId?: string) => {
    // TODO: Replace with actual API call
    return generateCourseRoadmap(prompt);
  },
  saveProgress: async (nodeId: string, progress: number, userId: string) => {
    // TODO: Implement API call to save progress
    console.log('Saving progress:', { nodeId, progress, userId });
  },
  getUserProgress: async (userId: string) => {
    // TODO: Implement API call to get user progress
    return {};
  },
  updateNodeCompletion: async (nodeId: string, completed: boolean, userId: string) => {
    // TODO: Implement API call to update completion status
    console.log('Updating completion:', { nodeId, completed, userId });
  }
};