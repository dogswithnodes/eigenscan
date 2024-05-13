import { unparse } from 'papaparse';

export const downloadCsv = (data: Array<Record<string, unknown>>, fileName = 'data') => {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([unparse(data)], { type: 'text/plain' }));
  link.download = `${fileName}.csv`;
  link.click();
  link.remove();
};
