import { SubmitHandler, useForm } from "react-hook-form";
import { EInputTypes, Input } from "../input/input.component";
import styles from '../default-form/default-form.component.module.scss'
import { useCreateLabel } from "../../api/services/labels.service";

export interface ICreateLabelForm {
    caption: string;
    color: string;
}

export const CreateLabelForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<ICreateLabelForm>({
        mode: 'onChange',
        defaultValues: {
            caption: '',
            color: '',
        }
    });

    const onSubmit: SubmitHandler<ICreateLabelForm> = async(data, event) => {
        event?.preventDefault()
        const createLabel = useCreateLabel
        try {
            const response = await createLabel(data);
            return response
        } catch (error) {
            console.error('Ошибка при создании пользователя:', error);
        }
    };

    return (
        <form className={styles['create_wrapper_form']} onSubmit={handleSubmit(onSubmit)}>
            <ul className={styles['create_ul_form']}>
                <Input 
                    className={styles['create_input_form']} 
                    {...register('caption', { 
                        required: 'Поле firstName обязательно для заполнения', 
                    })}  
                    type={EInputTypes.TEXT} 
                    placeholder="caption" 
                />
                {errors.caption && <p style={{color: 'red'}}>{errors.caption.message}</p>}
                
                <Input 
                    className={styles['create_input_form']} 
                    {...register('color', { 
                        required: 'Поле lastName обязательно для заполнения' 
                    })} 
                    type={EInputTypes.COLOR} 
                    placeholder="color" 
                />
                {errors.color && <p style={{color: 'red'}}>{errors.color.message}</p>}
                
                
                <button type="submit">Создать</button>
            </ul>
        </form>
    );
};