import { EOL as LINE_SEPARATOR } from 'os';

/**
 * @param {string} csvData - CSV 형식의 문자열
 * @returns {Array<Record<string, string>>} - CSV 데이터를 파싱한 객체 배열
 */
const parseCsv = (csvData) => {
  const rows = csvData.split(LINE_SEPARATOR).map((row) => row.split(','));
  const headers = rows.shift();
  return rows.map((row) => Object.fromEntries(row.map((value, index) => [headers[index], value])));
};

export default parseCsv;
