import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../../services/api.js';
import { getDashboardRoute } from '../../utils/auth';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, User } from 'lucide-react';

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('user');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      console.log('Selected role for registration:', role);
      let response;
      if (isRegistering) {
        console.log('Registering with role:', role);
        response = await register({ email, password, firstName, lastName, usersRole: role });
        console.log('Registration response:', response);
        setSuccess('Account created successfully! Redirecting...');
      } else {
        response = await login({ email, password });
        console.log('Login response:', response);
        setSuccess('Login successful! Redirecting...');
      }
      
      // Debug: Check the full user object structure
      console.log('Full user object:', response);
      console.log('User object keys:', response ? Object.keys(response) : 'No response');
      console.log('usersRole from response:', response?.usersRole);
      console.log('role from response:', response?.role);
      
      // Get the actual user role from response
      const userRole = response.usersRole || response.role || role;
      console.log('User role detected:', userRole);
      
      // Store user data in localStorage immediately BEFORE getting dashboard route
      if (response && response._id) {
        localStorage.setItem('user', JSON.stringify(response));
        localStorage.setItem('token', response.token || 'authenticated');
        console.log('User data stored in localStorage');
      }
      
      // Navigate to appropriate dashboard based on role (now localStorage has the data)
      const dashboardRoute = getDashboardRoute();
      console.log('Navigating to:', dashboardRoute);
      
      // Navigate immediately (no delay needed)
      navigate(dashboardRoute);
    } catch (err) {
      console.error('Auth error:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      
      let errorMessage = isRegistering ? 'Registration failed. Email might be taken.' : 'Login failed. Please check your credentials.';
      
      // More specific error messages based on response
      if (err.response && err.response.data && err.response.data.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background">
      {/* Animated Background Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/20 blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-success/10 blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding */}
          <div className="hidden lg:block space-y-8 animate-fade-in-left">
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">Industry-Leading Platform</span>
            </div>

            <div>
              <h1 className="text-6xl font-bold text-foreground mb-4">
                Welcome to
                <span className="block gradient-text bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Executive IS
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-md">
                Transform your business operations with intelligent insights and real-time analytics
              </p>
            </div>

            <div className="space-y-4">
              {[
                { icon: '📊', title: 'Real-Time Analytics', desc: 'Monitor performance instantly' },
                { icon: '🚀', title: 'Lightning Fast', desc: 'Optimized for speed' },
                { icon: '🔒', title: 'Secure & Reliable', desc: 'Enterprise-grade protection' }
              ].map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-white/60 backdrop-blur-sm border border-border/50 hover:shadow-alibaba-lg transition-all duration-300 hover:-translate-y-1"
                  style={{ animationDelay: `${i * 150}ms` }}
                >
                  <div className="text-3xl">{feature.icon}</div>
                  <div>
                    <h3 className="font-semibold text-foreground">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="w-full max-w-md mx-auto animate-fade-in-right">
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-alibaba-lg border border-border/50 p-8 md:p-10">
              {/* Logo for mobile */}
              <div className="lg:hidden mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-2xl gradient-orange flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-white">EIS</span>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground">
                  {isRegistering ? 'Create Account' : 'Sign In'}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {isRegistering ? 'Join EIS today' : 'Access your executive dashboard'}
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-error/10 border border-error/30 rounded-xl animate-shake">
                  <p className="text-sm text-error font-medium">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="mb-6 p-4 bg-success/10 border border-success/30 rounded-xl">
                  <p className="text-sm text-success font-medium">{success}</p>
                </div>
              )}

              <form onSubmit={submit} className="space-y-5">
                {isRegistering && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-sm font-semibold text-foreground mb-2">First Name</label>
                      <div className="relative">
                        <User size={18} className="absolute left-3 top-3.5 text-muted-foreground" />
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="John"
                          required
                          className="w-full pl-10 pr-4 py-3 text-sm bg-surface border-2 border-input rounded-xl focus:outline-none focus:border-primary transition-all"
                        />
                      </div>
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-foreground mb-2">Last Name</label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        required
                        className="w-full px-4 py-3 text-sm bg-surface border-2 border-input rounded-xl focus:outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div className="group">
                  <label htmlFor="email" className="block text-sm font-semibold text-foreground mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-all group-focus-within:text-primary">
                      <Mail size={20} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="w-full pl-12 pr-4 py-3.5 text-sm bg-surface border-2 border-input rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="group">
                  <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Lock size={20} className="text-muted-foreground group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder={isRegistering ? "Create a password" : "Enter your password"}
                      required
                      className="w-full pl-12 pr-12 py-3.5 text-sm bg-surface border-2 border-input rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                {/* Role Selector */}
                <div>
                  <label htmlFor="role" className="block text-sm font-semibold text-foreground mb-2">
                    {isRegistering ? 'Register As' : 'Login As'}
                  </label>
                  <select
                    id="role"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-4 py-3.5 text-sm bg-surface border-2 border-input rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all"
                  >
                    <option value="user">Customer</option>
                    <option value="admin">Administrator</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="relative w-full py-4 px-6 text-sm font-semibold text-white gradient-orange rounded-xl transition-all overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <div className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>{isRegistering ? 'Create Account' : 'Sign In'}</span>
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </div>
                </button>
              </form>

              {/* Toggle Login/Register */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  {isRegistering ? "Already have an account?" : "Don't have an account?"}
                  <button
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="ml-2 font-bold text-primary hover:underline focus:outline-none"
                  >
                    {isRegistering ? "Sign In" : "Sign Up"}
                  </button>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(-100vh) translateX(100px); opacity: 0; }
        }
        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-float { animation: float linear infinite; }
        .animate-fade-in-left { animation: fade-in-left 0.6s ease-out; }
        .animate-fade-in-right { animation: fade-in-right 0.6s ease-out; }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
}
