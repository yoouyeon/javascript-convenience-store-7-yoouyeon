const validateUtils = {
  isValidString: (str) => !!str && str.trim().length > 0,
  isValidNumber: (num) =>
    !!num && !Number.isNaN(Number(num)) && Number(num) >= 0 && Number.isInteger(Number(num)),
  isValidDate: (date) => {
    const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
    return !!date && DATE_PATTERN.test(date);
  },
  isValidYesOrNo: (str) => ['Y', 'N'].includes(str),
};

export default validateUtils;
