'use client';

import Link from 'next/link';
import { Lock, ArrowRight } from 'lucide-react';

interface LockedFeatureProps {
  feature: string;
  description: string;
  currentPlan: string;
  requiredPlan: string;
  benefits?: string[];
}

export function LockedFeature({
  feature,
  description,
  currentPlan,
  requiredPlan,
  benefits = [],
}: LockedFeatureProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center border-2 border-dashed border-border rounded-lg bg-background/50">
      <Lock className="w-12 h-12 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold mb-2">{feature} is Locked</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
      
      {benefits.length > 0 && (
        <div className="mb-6 text-sm text-left bg-card p-4 rounded-lg w-full max-w-md">
          <p className="font-medium mb-2">Unlock with {requiredPlan} plan:</p>
          <ul className="space-y-1">
            {benefits.map((benefit, i) => (
              <li key={i} className="text-muted-foreground">✓ {benefit}</li>
            ))}
          </ul>
        </div>
      )}

      <Link
        href="/pricing"
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:opacity-90 transition"
      >
        Upgrade to {requiredPlan}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
