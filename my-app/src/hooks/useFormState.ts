'use client';

import { useState, ChangeEvent } from 'react';

interface UseFormStateReturn<T> {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  resetForm: (initialData?: T) => void;
  setField: (field: keyof T, value: any) => void;
}

export function useFormState<T extends Record<string, any>>( initialState: T): UseFormStateReturn<T> {
  const [formData, setFormData] = useState<T>(initialState);

  const handleChange = ( e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = (newInitialData?: T) => { setFormData(newInitialData || initialState); };

  const setField = (field: keyof T, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return {
    formData,
    setFormData,
    handleChange,
    resetForm,
    setField,
  };
}
