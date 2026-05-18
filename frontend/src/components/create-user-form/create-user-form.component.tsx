import { SubmitHandler, useForm } from "react-hook-form";
import { EInputTypes, Input } from "../input/input.component";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCreateUser } from "../../api/services/user.service";
import styles from '../default-form/default-form.component.module.scss'

export interface ICreateUserForm {
    firstName: string;
    lastName: string;
    bio: string;
}

export const CreateUserForm = () => {
    const { register, handleSubmit, reset, formState: { errors } } = useForm<ICreateUserForm>({
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            lastName: '',
            bio: '',
        }
    });

    const queryClient = useQueryClient();

    const { mutateAsync: createUser, isPending } = useMutation({
        mutationFn: (data: ICreateUserForm) => useCreateUser(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            reset();
        },
        onError: (error) => {
            console.error('Ошибка при создании пользователя:', error);
        }
    });

    const onSubmit: SubmitHandler<ICreateUserForm> = async (data, event) => {
        event?.preventDefault()
        try {
            await createUser(data);
        } catch (error) {
            console.error('Ошибка при создании пользователя:', error);
        }
    };

    return (
        <form className={styles['create_wrapper_form']} onSubmit={handleSubmit(onSubmit)}>
            <ul className={styles['create_ul_form']}>
                <li style={{ listStyle: 'none' }}>
                    <label className="input-label">First Name</label>
                    <Input
                        className={styles['create_input_form']}
                        {...register('firstName', {
                            required: 'First name is required',
                            pattern: {
                                value: /^[A-Za-zА-Яа-яЁё\s-]+$/,
                                message: 'Only letters, spaces and hyphens allowed'
                            }
                        })}
                        type={EInputTypes.TEXT}
                        placeholder="e.g. John"
                        onDisabled={isPending}
                    />
                    {errors.firstName && <p className={styles['input_error']}>{errors.firstName.message}</p>}
                </li>

                <li style={{ listStyle: 'none' }}>
                    <label className="input-label">Last Name</label>
                    <Input
                        className={styles['create_input_form']}
                        {...register('lastName', {
                            required: 'Last name is required'
                        })}
                        type={EInputTypes.TEXT}
                        placeholder="e.g. Doe"
                        onDisabled={isPending}
                    />
                    {errors.lastName && <p className={styles['input_error']}>{errors.lastName.message}</p>}
                </li>

                <li style={{ listStyle: 'none' }}>
                    <label className="input-label">Professional Bio</label>
                    <Input
                        className={styles['create_input_form']}
                        {...register('bio', {
                            required: 'Biography is required',
                            minLength: {
                                value: 5,
                                message: 'Bio must be at least 5 characters long'
                            }
                        })}
                        type={EInputTypes.TEXT}
                        placeholder="e.g. Full-Stack Developer"
                        onDisabled={isPending}
                    />
                    {errors.bio && <p className={styles['input_error']}>{errors.bio.message}</p>}
                </li>

                <button type="submit" disabled={isPending}>
                    {isPending ? 'Onboarding...' : '➕ Onboard Teammate'}
                </button>
            </ul>
        </form>
    );
};