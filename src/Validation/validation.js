
export const validateLength = (value, min, max) => {
    
    const alphabetRegex = /^[a-zA-Z]+$/;
    if (!alphabetRegex.test(value)) {
      return 'Input must contain only alphabetic characters.';
    }
   
    if (value.length < min || value.length > max) {
      return `Input must be between ${min} and ${max} characters.`;
    }
    return '';
  };
  
  export const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return 'Please enter a valid email address.';
    }
    return '';
  };
  