import { ref, computed } from 'vue'
import type { ValidationRule } from '@/types'

export function useFormValidation<T extends Record<string, any>>(initialValues: T) {
  const values = ref<T>({ ...initialValues })
  const errors = ref<Partial<Record<keyof T, string>>>({})
  const touched = ref<Partial<Record<keyof T, boolean>>>({})
  const isSubmitting = ref(false)

  const validationRules: Record<string, ValidationRule> = {
    required: (value: any) => !!value || 'This field is required',
    email: (value: string) => {
      const pattern = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
      return !value || pattern.test(value) || 'Invalid email address'
    },
    minLength: (length: number) => (value: string) => {
      return !value || value.length >= length || `Minimum length is ${length} characters`
    },
    maxLength: (length: number) => (value: string) => {
      return !value || value.length <= length || `Maximum length is ${length} characters`
    },
    pattern: (pattern: RegExp, message: string) => (value: string) => {
      return !value || pattern.test(value) || message
    },
    match: (field: keyof T, message: string) => (value: any) => {
      return !value || value === values.value[field] || message
    }
  }

  const validateField = (field: keyof T, rules: ValidationRule[]) => {
    const value = values.value[field]
    const fieldErrors = rules
      .map(rule => rule(value))
      .filter(error => typeof error === 'string')

    if (fieldErrors.length > 0) {
      errors.value[field] = fieldErrors[0]
      return false
    }

    delete errors.value[field]
    return true
  }

  const validateForm = (fieldRules: Partial<Record<keyof T, ValidationRule[]>>) => {
    let isValid = true
    Object.entries(fieldRules).forEach(([field, rules]) => {
      if (!validateField(field as keyof T, rules)) {
        isValid = false
      }
    })
    return isValid
  }

  const handleBlur = (field: keyof T) => {
    touched.value[field] = true
  }

  const handleChange = (field: keyof T, value: any) => {
    values.value[field] = value
    if (touched.value[field]) {
      validateField(field, [])
    }
  }

  const resetForm = () => {
    values.value = { ...initialValues }
    errors.value = {}
    touched.value = {}
    isSubmitting.value = false
  }

  const isFieldValid = (field: keyof T) => {
    return !errors.value[field] && touched.value[field]
  }

  const isFieldInvalid = (field: keyof T) => {
    return !!errors.value[field] && touched.value[field]
  }

  const isValid = computed(() => {
    return Object.keys(errors.value).length === 0
  })

  return {
    values,
    errors,
    touched,
    isSubmitting,
    validationRules,
    validateField,
    validateForm,
    handleBlur,
    handleChange,
    resetForm,
    isFieldValid,
    isFieldInvalid,
    isValid
  }
} 