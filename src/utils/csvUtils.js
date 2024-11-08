import { readFile } from 'fs/promises';
import { EOL as LINE_SEPARATOR } from 'os';

const csvUtils = Object.freeze({
  async readCsv(filePath) {
    const rawData = await readFile(filePath, 'utf8');
    return rawData;
  },

  /**
   * @param {string} csvData - CSV 형식의 문자열
   * @returns {Array<Record<string, string>>} - CSV 데이터를 파싱한 객체 배열
   */
  parseCsv(csvData) {
    const rows = csvData.split(LINE_SEPARATOR).map((row) => row.split(','));
    const headers = rows.shift();
    return rows.map((row) =>
      Object.fromEntries(row.map((value, index) => [headers[index], value]))
    );
  },

  async readParsedCsv(filePath) {
    const csvData = await this.readCsv(filePath);
    return this.parseCsv(csvData);
  },
});

export default csvUtils;
