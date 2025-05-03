import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addTaskLabel, removeTaskLabel } from '../../api/services/task-labels.service';
import { ITask } from '../../api/services/task-labels.service';

interface ILabel {
    id: string;
    caption: string 
}

interface LabelListProps {
    labels: ILabel[]; 
    task: ITask;
}

export const LabelList: React.FC<LabelListProps> = ({ labels = [], task }) => {
    const queryClient = useQueryClient();

    const safeLabels = Array.isArray(labels) ? labels : [];

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
        const isLabelAttached = task.task_labels?.some(l => l.label_id === labelId);

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
        <div>
            {safeLabels.map((label) => (
                <div
                    key={label.id}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}
                >
                    <input
                        type="checkbox"
                        checked={task.task_labels?.some(l => l.label_id === label.id)}
                        onChange={() => handleLabelToggle(label.id)}
                    />
                    <span>{label.caption}</span>
                </div>
            ))}
        </div>
    );
};
