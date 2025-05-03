// import { useForm, UseFormRegister, FieldErrors, FieldValues, Path } from "react-hook-form";
// import { IInputProps, Input } from "../input/input.component";

// interface IDefaultFormProps {
//   fields: IInputProps[],
//   onSubmit: () => void;
//   errors: FieldErrors<FieldValues>;
//   register: UseFormRegister<FieldValues>;
// }

// export const DefaultForm = ({ fields, onSubmit, errors, register }: IDefaultFormProps) => {
  
//   return (
//     <form onSubmit={onSubmit}>
//       {fields.map((field, index) => (
//         <div key={index}>
//           <Input 
//             name={field.name} 
//             {...field} 
//             {...register(field.name)} 
//           />
//           {errors[field.name] && <span>{errors[field.name].message}</span>}
//         </div>
//       ))}
//     </form>
//   );
// }