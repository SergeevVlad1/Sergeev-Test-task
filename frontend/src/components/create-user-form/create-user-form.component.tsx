import { SubmitHandler, useForm } from "react-hook-form";
import { EInputTypes, Input } from "../input/input.component";
import { useCreateUser } from "../../api/services/user.service";
import styles from '../default-form/default-form.component.module.scss'

export interface ICreateUserForm {
    firstName: string;
    lastName: string;
    bio: string;
}

export const CreateUserForm = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<ICreateUserForm>({
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            bio: '',
        }
    });

    const onSubmit: SubmitHandler<ICreateUserForm> = async(data, event) => {
        event?.preventDefault()
        const createUser = useCreateUser
        try {
            const response = await createUser(data);
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
                    {...register('firstName', { 
                        required: 'Поле firstName обязательно для заполнения', 
                        pattern: {
                            value: /^[A-Za-zА-Яа-яЁё\s-]+$/,
                            message: 'Invalid firstName'
                        } 
                    })}  
                    type={EInputTypes.TEXT} 
                    placeholder="first name" 
                />
                {errors.firstName && <p style={{color: 'red'}}>{errors.firstName.message}</p>}
                
                <Input 
                    className={styles['create_input_form']} 
                    {...register('lastName', { 
                        required: 'Поле lastName обязательно для заполнения' 
                    })} 
                    type={EInputTypes.TEXT} 
                    placeholder="last name" 
                />
                {errors.lastName && <p style={{color: 'red'}}>{errors.lastName.message}</p>}
                
                <Input 
                    className={styles['create_input_form']} 
                    {...register('bio', { 
                        required: 'Поле bio обязательно для заполнения' 
                    })} 
                    type={EInputTypes.TEXT} 
                    placeholder="bio" 
                />
                {errors.bio && <p className={styles['input_error']}>{errors.bio.message}</p>}
                
                <button type="submit">Создать</button>
            </ul>
        </form>
    );
};