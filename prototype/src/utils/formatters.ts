/**
 * Utility helper functions for formatting currency, dates, and status labels
 */

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  if (!dateString) {
return '';
}

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
return dateString;
}

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export const getStatusBadgeColor = (status: string): string => {
  switch (status.toUpperCase()) {
    case 'CONFIRMED':
    case 'ACTIVE':
    case 'COMPLETED':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'IN ROUTE':
    case 'IN PROGRESS':
      return 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30';
    case 'PENDING':
    case 'SCHEDULED':
      return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
    case 'MAINTENANCE':
    case 'CANCELLED':
      return 'bg-rose-500/10 text-rose-300 border-rose-500/30';
    default:
      return 'bg-slate-500/10 text-slate-300 border-slate-500/30';
  }
};
