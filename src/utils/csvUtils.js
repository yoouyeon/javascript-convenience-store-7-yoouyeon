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
    // 중간에 빈 줄이 있을 수 있으므로 filter로 제거
    const rows = csvData
      .split(LINE_SEPARATOR)
      .filter((row) => row)
      .map((row) => row.split(','));
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
