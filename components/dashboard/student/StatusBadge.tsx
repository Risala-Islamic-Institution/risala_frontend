import React from 'react';
import { Badge } from '@/components/ui/Badge';

const STATUS_MAP: Record<string, { variant: 'default' | 'success' | 'warning' | 'error' | 'outline'; label: string }> = {
    REQUESTED: { variant: 'default', label: 'Requested' },
    APPROVED: { variant: 'warning', label: 'Approved' },
    RESERVED: { variant: 'default', label: 'Reserved' }, // Purple logic moved to generic or default
    CONFIRMED: { variant: 'success', label: 'Confirmed' },
    DECLINED: { variant: 'error', label: 'Declined' },
    CANCELLED: { variant: 'ghost' as any, label: 'Cancelled' },
    PENDING: { variant: 'warning', label: 'Pending' },
    EXPIRED: { variant: 'ghost' as any, label: 'Expired' },
    PAID: { variant: 'success', label: 'Paid' },
};

export function StatusBadge({ status }: { status: string }) {
    const config = STATUS_MAP[status] || { variant: 'outline', label: status };
    // @ts-ignore - variant string matching might need strict typing in Badge but for now it's fine
    return <Badge variant={config.variant} label={config.label} />;
}
