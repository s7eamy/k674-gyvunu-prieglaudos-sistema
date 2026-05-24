import { useTranslation } from 'react-i18next';

export type EnumGroup =
  | 'animal_type'
  | 'animal_size'
  | 'animal_size_short'
  | 'animal_temperament'
  | 'adoption_status'
  | 'order_status'
  | 'volunteer_status'
  | 'merch_color'
  | 'merch_design'
  | 'vaccinated';

export function useEnumLabel() {
  const { t } = useTranslation('enums');
  return (group: EnumGroup, value: string | null | undefined, fallback = 'unknown'): string => {
    const key = (value || fallback).toString().toLowerCase();
    return t(`${group}.${key}`, { defaultValue: value ?? fallback });
  };
}
