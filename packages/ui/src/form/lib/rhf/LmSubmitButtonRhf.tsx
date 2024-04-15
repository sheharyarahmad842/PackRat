import { LmButton, LmButtonProps } from '@tamagui-extras/core';
import { FieldValues, useFormContext, UseFormReturn } from 'react-hook-form';

export type LmButtonRhfProps<T extends FieldValues> = LmButtonProps & {
  onSubmit: (data: T, context: UseFormReturn<T, any>) => void | Promise<void>;
};

export function LmSubmitButtonRhf<
  TFieldValues extends FieldValues = FieldValues,
>({ onSubmit, ...props }: LmButtonRhfProps<TFieldValues>) {
  const formContext = useFormContext<TFieldValues>();
  const { handleSubmit, formState } = formContext;
  return (
    <LmButton
      {...(props as any)}
      onPress={handleSubmit((data) => {
        onSubmit(data, formContext);
      })}
      loading={formState.isValidating || props.loading}
    />
  );
}
