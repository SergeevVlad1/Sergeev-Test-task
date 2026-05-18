import { SubmitHandler, useForm } from "react-hook-form";
import { EInputTypes, Input } from "../input/input.component";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCreateLabel } from "../../api/services/labels.service";
import styles from '../default-form/default-form.component.module.scss'

export interface ICreateLabelForm {
    caption: string;
    color: string;
}

export const CreateLabelForm = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ICreateLabelForm>({
        mode: 'onChange',
        defaultValues: {
            caption: '',
            color: '#3b82f6',
        }
    });

    const queryClient = useQueryClient();

    const { mutateAsync: createLabel, isPending } = useMutation({
        mutationFn: (data: ICreateLabelForm) => useCreateLabel(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['labels'] });
            reset();
        },
        onError: (error) => {
            console.error('Ошибка при создании ярлыка:', error);
        }
    });

    const onSubmit: SubmitHandler<ICreateLabelForm> = async(data, event) => {
        event?.preventDefault()
        try {
            await createLabel(data);
        } catch (error) {
            console.error('Ошибка при создании ярлыка:', error);
        }
    };

    return (
        <form className={styles['create_wrapper_form']} onSubmit={handleSubmit(onSubmit)}>
            <ul className={styles['create_ul_form']}>
                <li style={{ listStyle: 'none' }}>
                    <label className="input-label">Label Caption</label>
                    <Input 
                        className={styles['create_input_form']} 
                        {...register('caption', { 
                            required: 'Caption is required', 
                            minLength: {
                                value: 2,
                                message: 'Caption must be at least 2 characters'
                            }
                        })}  
                        type={EInputTypes.TEXT} 
                        placeholder="e.g. In Progress, Feature, Bug" 
                        onDisabled={isPending}
                    />
                    {errors.caption && <p className={styles['input_error']}>{errors.caption.message}</p>}
                </li>
                
                <li style={{ listStyle: 'none' }}>
                    <label className="input-label">Label Theme Color</label>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <Input 
                            className={styles['create_input_form']} 
                            {...register('color', { 
                                required: 'Color is required' 
                            })} 
                            type={EInputTypes.COLOR} 
                            style={{ 
                                width: '50px', 
                                height: '42px', 
                                padding: '4px',
                                cursor: 'pointer',
                                background: 'rgba(13, 18, 36, 0.8)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px'
                            }}
                            onDisabled={isPending}
                        />
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Choose tag accent color
                        </span>
                    </div>
                    {errors.color && <p className={styles['input_error']}>{errors.color.message}</p>}
                </li>
                
                <button type="submit" disabled={isPending}>
                    {isPending ? 'Creating...' : '➕ Create Tag'}
                </button>
            </ul>
        </form>
    );
};