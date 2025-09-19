import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye, EyeOff, BookOpen, Users, Settings, ArrowLeft } from 'lucide-react';

// Simple Dashboard Component
function Dashboard({ user, onLogout }) {
  // If user is logged in, show dashboard
 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">EduHub Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                  user.role === 'student' ? 'bg-blue-500' : 
                  user.role === 'teacher' ? 'bg-green-500' : 'bg-purple-500'
                }`}>
                  {user.email.charAt(0).toUpperCase()}
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user.email}</p>
                  <p className="text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Welcome to your {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Dashboard
            </h2>
            <p className="text-gray-600 mb-8">
              You have successfully logged in as <span className="font-semibold">{user.email}</span>
            </p>
            
            {/* Role-specific content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {user.role === 'student' && (
                <>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">My Courses</h3>
                    <p className="text-gray-600">View and access your enrolled courses</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Users className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Assignments</h3>
                    <p className="text-gray-600">Check and submit your assignments</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Settings className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Grades</h3>
                    <p className="text-gray-600">View your academic progress</p>
                  </div>
                </>
              )}
              
              {user.role === 'teacher' && (
                <>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">My Classes</h3>
                    <p className="text-gray-600">Manage your teaching courses</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Students</h3>
                    <p className="text-gray-600">View and manage student progress</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Settings className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Grading</h3>
                    <p className="text-gray-600">Grade assignments and exams</p>
                  </div>
                </>
              )}
              
              {user.role === 'admin' && (
                <>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Settings className="h-6 w-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">System Settings</h3>
                    <p className="text-gray-600">Configure system preferences</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
                    <p className="text-gray-600">Manage students and teachers</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Course Management</h3>
                    <p className="text-gray-600">Create and manage courses</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function LoginPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState('student');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginError, setLoginError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    resetEmail: ''
  });

  // Hardcoded credentials for testing
  const validCredentials = [
    { email: 'student@edu.com', password: 'student123', role: 'student' },
    { email: 'teacher@edu.com', password: 'teacher123', role: 'teacher' },
    { email: 'admin@edu.com', password: 'admin123', role: 'admin' }
  ];

  const carouselSlides = [
    {
      title: "Welcome to EduHub",
      subtitle: "Your Gateway to Learning Excellence",
      description: "Access courses, track progress, and connect with educators in our comprehensive learning management system.",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Seamless Learning Experience",
      subtitle: "Study Anywhere, Anytime",
      description: "Interactive courses, real-time collaboration, and personalized learning paths designed for your success.",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    {
      title: "Connect & Collaborate",
      subtitle: "Building Knowledge Together",
      description: "Join a community of learners, share insights, and grow together in our collaborative environment.",
      image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    }
  ];

  const roles = [
    { id: 'student', label: 'Student', icon: BookOpen, color: 'bg-blue-500' },
    { id: 'teacher', label: 'Teacher', icon: Users, color: 'bg-green-500' },
    { id: 'admin', label: 'Admin', icon: Settings, color: 'bg-purple-500' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleLogin = () => {
    if (!formData.email || !formData.password) {
      setLoginError('Please fill in all fields');
      return;
    }

    // Check credentials
    const user = validCredentials.find(
      cred => cred.email === formData.email && 
              cred.password === formData.password && 
              cred.role === selectedRole
    );

    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      setLoginError('');
      // Clear form data
      setFormData({ email: '', password: '', resetEmail: '' });
    } else {
      setLoginError('Invalid credentials or role mismatch. Please check your email, password, and selected role.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setFormData({ email: '', password: '', resetEmail: '' });
    setSelectedRole('student');
    setLoginError('');
  };

  const handleForgotPassword = () => {
    if (!formData.resetEmail) {
      alert('Please enter your email address');
      return;
    }
    console.log('Password reset for:', formData.resetEmail);
    // Handle forgot password logic here
    alert('Password reset link sent to your email!');
    setShowForgotPassword(false);
    setFormData(prev => ({ ...prev, resetEmail: '' }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Side - Carousel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900">
        {/* Carousel Content */}
        <div className="absolute inset-0 flex transition-transform duration-500 ease-in-out"
             style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
          {carouselSlides.map((slide, index) => (
            <div key={index} className="w-full flex-shrink-0 relative">
              <div className="absolute inset-0 bg-black bg-opacity-40"></div>
              <img 
                src={slide.image} 
                alt={slide.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white px-8 max-w-lg">
                  <h2 className="text-4xl font-bold mb-4">{slide.title}</h2>
                  <h3 className="text-xl font-medium mb-6 text-blue-200">{slide.subtitle}</h3>
                  <p className="text-lg leading-relaxed text-gray-200">{slide.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-2 rounded-full transition-all duration-200"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {carouselSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-200 ${
                index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          {!showForgotPassword ? (
            <>
              {/* Header */}
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
                <p className="mt-2 text-gray-600">Sign in to your EduHub account</p>
                
                {/* Demo Credentials Info */}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-xs text-blue-800 font-medium mb-2">Demo Credentials:</p>
                  <div className="text-xs text-blue-700 space-y-1">
                    <div>Student: student@edu.com / student123</div>
                    <div>Teacher: teacher@edu.com / teacher123</div>
                    <div>Admin: admin@edu.com / admin123</div>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {loginError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-600">{loginError}</p>
                </div>
              )}

              {/* Role Selection */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Select Your Role</label>
                <div className="grid grid-cols-3 gap-3">
                  {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => {
                      setSelectedRole(role.id);
                      setLoginError(''); // Clear error when changing role
                    }}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          selectedRole === role.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <Icon className={`w-6 h-6 mx-auto mb-2 ${
                          selectedRole === role.id ? 'text-indigo-600' : 'text-gray-400'
                        }`} />
                        <span className={`text-sm font-medium ${
                          selectedRole === role.id ? 'text-indigo-600' : 'text-gray-600'
                        }`}>
                          {role.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Login Form */}
              <div className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => {
                      handleInputChange(e);
                      setLoginError(''); // Clear error when typing
                    }}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={formData.password}
                      onChange={(e) => {
                        handleInputChange(e);
                        setLoginError(''); // Clear error when typing
                      }}
                      className="w-full px-3 py-3 pr-10 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-gray-400" />
                      ) : (
                        <Eye className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200"
                  >
                    Forgot your password?
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleLogin}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Sign In
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <button className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
                    Contact your administrator
                  </button>
                </p>
              </div>
            </>
          ) : (
            <>
              {/* Forgot Password Form */}
              <div className="text-center">
                <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
                <p className="mt-2 text-gray-600">Enter your email to receive a reset link</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    id="resetEmail"
                    name="resetEmail"
                    type="email"
                    required
                    value={formData.resetEmail}
                    onChange={handleInputChange}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email address"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02]"
                >
                  Send Reset Link
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setFormData(prev => ({ ...prev, resetEmail: '' }));
                  }}
                  className="w-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Sign In
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}