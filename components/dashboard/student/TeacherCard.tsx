import React from 'react';
import { Card, CardBody, CardCover } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Teacher } from '@/types';

interface TeacherCardProps {
    teacher: Teacher;
    onBook: () => void;
    onPackage: () => void;
}

export function TeacherCard({ teacher, onBook, onPackage }: TeacherCardProps) {
    const name = teacher.user.full_name || teacher.user.username;
    const initial = name[0].toUpperCase();

    return (
        <Card className="h-full flex flex-col group border-primary/10 bg-white shadow-[0_12px_28px_rgba(15,61,46,0.08)] hover:shadow-[0_18px_42px_rgba(15,61,46,0.16)]">
            <CardCover className="h-36" />

            <CardBody className="flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-4">
                    <div className="-mt-14 w-24 h-24 rounded-2xl bg-white p-1.5 shadow-xl shadow-primary/15 relative z-10 group-hover:-translate-y-1 transition-transform duration-300">
                        <div className="w-full h-full rounded-xl overflow-hidden bg-primary/10 border border-primary/10 flex items-center justify-center">
                            {teacher.user.profile_picture ? (
                                <img
                                    src={teacher.user.profile_picture}
                                    alt={name}
                                    className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-500"
                                />
                            ) : (
                                <span className="text-3xl font-black text-primary">
                                    {initial}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="mt-2 text-right">
                        <span className="block text-xl font-black text-primary">${teacher.hourly_rate}</span>
                        <span className="text-[10px] font-bold text-secondary/30 uppercase tracking-widest">Per Hour</span>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-bold text-secondary">{name}</h3>
                    <div className="mt-2 flex items-center gap-2">
                        <Badge variant="warning" label={teacher.specialization || 'Instructor'} className="" />
                    </div>
                    <p className="text-sm text-secondary/60 mt-4 line-clamp-3 leading-relaxed">
                        {teacher.biography || 'Experienced instructor ready to guide you on your learning journey.'}
                    </p>
                </div>

                <div className="mt-auto pt-4 border-t border-primary/10 flex gap-2">
                    <Button variant="primary" className="flex-1 rounded-xl shadow-md shadow-primary/10" onClick={onBook}>
                        Book Session
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-xl border-primary/25 hover:bg-primary/5" onClick={onPackage}>
                        Package
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
}
