import { LmFormContainerBaseTypes } from './formContainerTypes';
import {
  Label,
  RadioGroup,
  RadioGroupProps,
  SizeTokens,
  SpaceTokens,
  XStack,
} from 'tamagui';
import { LmFormFieldContainer } from './LmFormFieldContainer';

export type LmRadioGroupProps = RadioGroupProps &
  LmFormContainerBaseTypes & {
    options: { label: string; value: string }[];
    size?: SizeTokens;
    name?: string;
    spaceItem?: SpaceTokens;
  };

export function LmRadioGroup({
  options,
  required,
  error,
  helperText,
  helperTextProps,
  label,
  labelInline,
  labelProps,
  size = '$3',
  spaceItem = '$2',
  containerProps,
  ...rest
}: LmRadioGroupProps) {
  return (
    <LmFormFieldContainer
      error={error}
      required={required}
      labelProps={labelProps}
      label={label}
      size={size}
      labelInline={labelInline}
      helperText={helperText}
      helperTextProps={helperTextProps}
      {...containerProps}
    >
      <RadioGroup
        space={rest.flexDirection === 'row' ? '$4' : '$1'}
        required={required}
        {...rest}
      >
        {options.map((option, i) => (
          <XStack
            key={`${rest.name}-${option.value}-${i}`}
            alignItems="center"
            space={spaceItem}
          >
            <RadioGroup.Item
              value={option.value}
              id={`${rest.name}-${option.value}-${i}`}
              size={size}
              pressTheme
            >
              <RadioGroup.Indicator />
            </RadioGroup.Item>

            <Label
              size={size}
              htmlFor={`${rest.name}-${option.value}-${i}`}
              cursor={'pointer'}
            >
              {option.label}
            </Label>
          </XStack>
        ))}
      </RadioGroup>
    </LmFormFieldContainer>
  );
}
