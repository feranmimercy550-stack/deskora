'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, Check, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getOnboardingProgress, completeProfileStep, completeOnboarding } from '@/lib/onboarding-service';
import { upsertProfile } from '@/lib/profile-service';
import { useAuth } from '@/hooks/useAuth';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

export function OnboardingWizard() {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    fullName: '',
    email: '',
    industry: '',
    countryCode: 'US'
  });

  const steps: OnboardingStep[] = [
    {
      id: 'profile',
      title: 'Complete Your Profile',
      description: 'Tell us about you and your business',
      icon: <Lock className="w-6 h-6" />,
      completed: false
    },
    {
      id: 'customer',
      title: 'Add Your First Customer',
      description: 'Get started by adding a customer',
      icon: <Lock className="w-6 h-6" />,
      completed: false
    },
    {
      id: 'invoice',
      title: 'Create Your First Invoice',
      description: 'Send your first invoice',
      icon: <Lock className="w-6 h-6" />,
      completed: false
    },
    {
      id: 'payment',
      title: 'Setup Payment Methods',
      description: 'Configure how you accept payments',
      icon: <Lock className="w-6 h-6" />,
      completed: false
    },
    {
      id: 'explore',
      title: 'Explore AI Features',
      description: 'Discover AI-powered insights',
      icon: <Lock className="w-6 h-6" />,
      completed: false
    }
  ];

  useEffect(() => {
    loadOnboardingProgress();
  }, [user?.id]);

  const loadOnboardingProgress = async () => {
    if (!user?.id) return;
    
    try {
      const progress = await getOnboardingProgress(user.id);
      if (progress?.completed_at) {
        setCurrentStep(-1); // Mark as complete
      }
    } catch (error) {
      console.error('Error loading onboarding:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = async () => {
    if (currentStep === 0) {
      // Complete profile step
      if (!formData.businessName || !formData.fullName) {
        alert('Please fill in all fields');
        return;
      }

      setLoading(true);
      try {
        if (user?.id) {
          await upsertProfile(user.id, {
            full_name: formData.fullName,
            business_name: formData.businessName,
            industry: formData.industry,
            country: formData.countryCode
          });
          await completeProfileStep(user.id);
        }
        setCurrentStep(1);
      } catch (error) {
        console.error('Error completing profile:', error);
        alert('Failed to save profile');
      } finally {
        setLoading(false);
      }
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      if (user?.id) {
        await completeOnboarding(user.id);
        setCurrentStep(-1);
      }
    }
  };

  if (currentStep === -1) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">Congratulations!</div>
        <p className="text-gray-600">Your onboarding is complete. Welcome to Risely!</p>
      </div>
    );
  }

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Let's Get Started</CardTitle>
          <CardDescription>Complete these steps to set up your Risely account</CardDescription>
          <Progress value={progress} className="mt-4" />
        </CardHeader>
        <CardContent>
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              {steps.map((step, idx) => (
                <div key={step.id} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      idx <= currentStep
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {idx < currentStep ? <Check className="w-5 h-5" /> : idx + 1}
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 ${
                        idx < currentStep ? 'bg-purple-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Current Step Content */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">{steps[currentStep].title}</h3>
            <p className="text-gray-600 mb-6">{steps[currentStep].description}</p>

            {currentStep === 0 && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label htmlFor="businessName">Business Name</Label>
                  <Input
                    id="businessName"
                    name="businessName"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    placeholder="Your business name"
                  />
                </div>
                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <select
                    id="industry"
                    name="industry"
                    value={formData.industry}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">Select industry</option>
                    <option value="tech">Technology</option>
                    <option value="retail">Retail</option>
                    <option value="services">Services</option>
                    <option value="finance">Finance</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-900">
                  Navigate to the Customers section and click "Add Customer" to continue.
                </p>
              </div>
            )}

            {currentStep === 2 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-900">
                  Go to Invoices and create your first invoice to proceed to the next step.
                </p>
              </div>
            )}

            {currentStep === 3 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-900">
                  Visit Settings to configure your payment methods.
                </p>
              </div>
            )}

            {currentStep === 4 && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-blue-900">
                  Explore the AI Features section to discover insights and recommendations.
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              variant="outline"
              disabled={currentStep === 0}
            >
              Back
            </Button>
            <Button
              onClick={handleNextStep}
              disabled={loading}
              className="ml-auto"
            >
              {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
