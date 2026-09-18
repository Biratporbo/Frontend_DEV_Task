/**
 * Password Strength Evaluator
 * Evaluates complexity criteria and calculates visual score.
 */

export const evaluatePasswordStrength = (password) => {
  if (!password) {
    return {
      score: 0,
      label: 'Enter a password',
      color: '#cbd5e1',
      percentage: 0,
      criteria: [
        { id: 'length', label: 'At least 8 characters', met: false },
        { id: 'lowercase', label: 'At least one lowercase letter (a-z)', met: false },
        { id: 'uppercase', label: 'At least one uppercase letter (A-Z)', met: false },
        { id: 'number', label: 'At least one number (0-9)', met: false },
        { id: 'special', label: 'At least one special character (!@#$%^&*)', met: false },
      ],
    };
  }

  const criteria = [
    {
      id: 'length',
      label: 'At least 8 characters',
      met: password.length >= 8,
    },
    {
      id: 'lowercase',
      label: 'At least one lowercase letter (a-z)',
      met: /[a-z]/.test(password),
    },
    {
      id: 'uppercase',
      label: 'At least one uppercase letter (A-Z)',
      met: /[A-Z]/.test(password),
    },
    {
      id: 'number',
      label: 'At least one number (0-9)',
      met: /[0-9]/.test(password),
    },
    {
      id: 'special',
      label: 'At least one special character (!@#$%^&*)',
      met: /[^A-Za-z0-9]/.test(password),
    },
  ];

  const metCount = criteria.filter((c) => c.met).length;

  let score = 0;
  let label = 'Very Weak';
  let color = '#ef4444';
  let percentage = 20;

  if (metCount <= 1) {
    score = 1;
    label = 'Weak';
    color = '#ef4444';
    percentage = 20;
  } else if (metCount === 2) {
    score = 2;
    label = 'Fair';
    color = '#f59e0b';
    percentage = 40;
  } else if (metCount === 3 || metCount === 4) {
    score = 3;
    label = 'Good';
    color = '#3b82f6';
    percentage = 75;
  } else if (metCount === 5) {
    score = 4;
    label = 'Strong';
    color = '#10b981';
    percentage = 100;
  }

  return {
    score,
    label,
    color,
    percentage,
    criteria,
  };
};

