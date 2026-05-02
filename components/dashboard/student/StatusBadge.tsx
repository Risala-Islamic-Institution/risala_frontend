import React from 'react';
import { Badge } from '@/components/ui/Badge';

type StatusVariant = 'default' | 'success' | 'warning' | 'error' | 'outline' | 'ghost';

const STATUS_MAP: Record<string, { variant: StatusVariant; label: string }> = {
    REQUESTED: { variant: 'default', label: 'Requested' },
    APPROVED: { variant: 'warning', label: 'Approved · pay' },
    RESERVED: { variant: 'warning', label: 'Reserved' },
    CONFIRMED: { variant: 'success', label: 'Confirmed' },
    DECLINED: { variant: 'error', label: 'Declined' },
    CANCELLED: { variant: 'ghost', label: 'Cancelled' },
    PENDING: { variant: 'warning', label: 'Pending' },
    EXPIRED: { variant: 'ghost', label: 'Expired' },
    PAID: { variant: 'success', label: 'Paid' },
};

export function StatusBadge({ status }: { status: string }) {
    const config = STATUS_MAP[status] || { variant: 'outline', label: status };
    return <Badge variant={config.variant} label={config.label} />;
}
