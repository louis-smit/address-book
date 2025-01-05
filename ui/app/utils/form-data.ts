export function jsonToFormData(
  json: Record<string, any>,
  formData: FormData = new FormData(),
  parentKey?: string
): FormData {
  for (const key in json) {
    if (json.hasOwnProperty(key)) {
      const value = json[key];
      const formKey = parentKey ? `${parentKey}[${key}]` : key;

      if (value instanceof File || value instanceof Blob) {
        // If the value is a file, append it directly
        formData.append(formKey, value);
      } else if (
        typeof value === "object" &&
        value !== null &&
        !(value instanceof Date)
      ) {
        // If the value is a nested object, call recursively
        jsonToFormData(value, formData, formKey);
      } else {
        // For other types (e.g., strings, numbers), append them directly
        formData.append(formKey, String(value));
      }
    }
  }
  return formData;
}
