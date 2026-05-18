import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTaskLabel, removeTaskLabel } from '../../api/services/task-labels.service';
import { ITask } from '../../api/services/task-labels.service';

interface ILabel {
    id: string;
    caption: string;
    color?: string;
}

interface LabelListProps {
    labels: ILabel[]; 
    task: ITask;
}

export const LabelList: React.FC<LabelListProps> = ({ labels = [], task }) => {
    const queryClient = useQueryClient();

    const safeLabels = Array.isArray(labels) ? labels : [];
    const isConfigMode = !task.id; // If task.id is empty, it's just displaying all labels

    const addMutation = useMutation({
        mutationFn: async ({ task, labelId }: { task: ITask; labelId: string }) => {
            return addTaskLabel(task, labelId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    });

    const removeMutation = useMutation({
        mutationFn: async ({ task, labelId }: { task: ITask; labelId: string }) => {
            return removeTaskLabel(task, labelId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
        }
    });

    const handleLabelToggle = async (labelId: string) => {
        if (isConfigMode) return;
        const isLabelAttached = task.task_labels?.some(l => String(l.label_id) === String(labelId));

        try {
            if (isLabelAttached) {
                await removeMutation.mutateAsync({
                    task,
                    labelId
                });
            } else {
                await addMutation.mutateAsync({
                    task,
                    labelId
                });
            }
        } catch (error) {
            console.error('Error toggling label:', error);
        }
    };

    return (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
            {safeLabels.map((label) => {
                const labelColor = label.color || '#3b82f6';
                const isAttached = !isConfigMode && task.task_labels?.some(l => String(l.label_id) === String(label.id));

                if (isConfigMode) {
                    // Config page: show beautiful color tags
                    return (
                        <div
                            key={label.id}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px',
                                padding: '6px 14px',
                                borderRadius: '20px',
                                background: `rgba(255, 255, 255, 0.03)`,
                                border: `1px solid rgba(255, 255, 255, 0.08)`,
                                color: 'var(--text-primary)',
                                fontSize: '0.85rem',
                                fontWeight: 600,
                            }}
                        >
                            <span 
                                style={{ 
                                    width: '10px', 
                                    height: '10px', 
                                    borderRadius: '50%', 
                                    background: labelColor,
                                    boxShadow: `0 0 8px ${labelColor}`
                                }} 
                            />
                            <span>{label.caption}</span>
                        </div>
                    );
                }

                // Inside Task cards: interactive pill checkboxes
                return (
                    <button
                        key={label.id}
                        onClick={() => handleLabelToggle(label.id)}
                        disabled={addMutation.isPending || removeMutation.isPending}
                        style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 12px',
                            borderRadius: '16px',
                            background: isAttached ? `${labelColor}1a` : 'rgba(255, 255, 255, 0.02)',
                            border: isAttached ? `1px solid ${labelColor}80` : `1px solid rgba(255, 255, 255, 0.06)`,
                            color: isAttached ? '#ffffff' : 'var(--text-secondary)',
                            fontSize: '0.78rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            outline: 'none',
                            userSelect: 'none',
                            boxShadow: isAttached ? `0 0 10px ${labelColor}15` : 'none',
                        }}
                        onMouseEnter={(e) => {
                            if (!isAttached) {
                                e.currentTarget.style.border = `1px solid ${labelColor}40`;
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                                e.currentTarget.style.color = 'var(--text-primary)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isAttached) {
                                e.currentTarget.style.border = `1px solid rgba(255, 255, 255, 0.06)`;
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
                                e.currentTarget.style.color = 'var(--text-secondary)';
                            }
                        }}
                    >
                        <span 
                            style={{ 
                                width: '6px', 
                                height: '6px', 
                                borderRadius: '50%', 
                                background: isAttached ? labelColor : 'var(--text-muted)',
                                transition: 'background 0.2s ease',
                                boxShadow: isAttached ? `0 0 6px ${labelColor}` : 'none',
                            }} 
                        />
                        <span>{label.caption}</span>
                    </button>
                );
            })}
        </div>
    );
};
