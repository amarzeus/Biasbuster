import { exportToCSV, exportToJSON, exportToExcel } from '../exportUtils';

describe('Export Utilities', () => {
  const mockData = [
    {
      id: 1,
      name: 'Test 1',
      value: 100,
      nested: { key: 'value' },
      array: [1, 2, 3],
      nullValue: null,
      undefinedValue: undefined,
    },
    {
      id: 2,
      name: 'Test 2',
      value: 200,
      nested: { key: 'value2' },
      array: [4, 5, 6],
      nullValue: null,
      undefinedValue: undefined,
    },
  ];

  beforeEach(() => {
    // Mock URL.createObjectURL
    global.URL.createObjectURL = jest.fn(() => 'mock-url');
    // Mock document.createElement
    document.createElement = jest.fn(() => ({
      setAttribute: jest.fn(),
      style: {},
      click: jest.fn(),
    })) as any;
    // Mock document.body.appendChild and removeChild
    document.body.appendChild = jest.fn();
    document.body.removeChild = jest.fn();
  });

  describe('exportToCSV', () => {
    it('should throw error for empty data', () => {
      expect(() => exportToCSV([], 'test')).toThrow('No data to export');
    });

    it('should create CSV with correct headers and data', () => {
      const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL');
      const createElementSpy = jest.spyOn(document, 'createElement');
      const appendChildSpy = jest.spyOn(document.body, 'appendChild');
      const removeChildSpy = jest.spyOn(document.body, 'removeChild');

      exportToCSV(mockData, 'test');

      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
    });

    it('should handle special characters in data', () => {
      const dataWithSpecialChars = [
        { name: 'Test, with comma', value: 'Value "with" quotes' },
      ];

      const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL');
      exportToCSV(dataWithSpecialChars, 'test');

      const blob = createObjectURLSpy.mock.calls[0][0];
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('text/csv;charset=utf-8;');
    });
  });

  describe('exportToJSON', () => {
    it('should throw error for empty data', () => {
      expect(() => exportToJSON([], 'test')).toThrow('No data to export');
    });

    it('should create JSON file with correct data', () => {
      const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL');
      const createElementSpy = jest.spyOn(document, 'createElement');
      const appendChildSpy = jest.spyOn(document.body, 'appendChild');
      const removeChildSpy = jest.spyOn(document.body, 'removeChild');

      exportToJSON(mockData, 'test');

      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
    });

    it('should handle complex nested objects', () => {
      const complexData = [
        {
          nested: {
            deep: {
              array: [1, 2, 3],
              object: { key: 'value' },
            },
          },
        },
      ];

      const createObjectURLSpy = jest.spyOn(URL, 'createObjectURL');
      exportToJSON(complexData, 'test');

      const blob = createObjectURLSpy.mock.calls[0][0];
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe('application/json');
    });
  });

  describe('exportToExcel', () => {
    it('should throw error for empty data', async () => {
      await expect(exportToExcel([], 'test')).rejects.toThrow('No data to export');
    });

    it('should create Excel file with correct data', async () => {
      // Mock xlsx library
      const mockXLSX = {
        utils: {
          json_to_sheet: jest.fn(),
          book_new: jest.fn(),
          book_append_sheet: jest.fn(),
        },
        writeFile: jest.fn(),
      };

      jest.mock('xlsx', () => mockXLSX);

      await exportToExcel(mockData, 'test');

      expect(mockXLSX.utils.json_to_sheet).toHaveBeenCalledWith(mockData);
      expect(mockXLSX.utils.book_new).toHaveBeenCalled();
      expect(mockXLSX.utils.book_append_sheet).toHaveBeenCalled();
      expect(mockXLSX.writeFile).toHaveBeenCalled();
    });

    it('should handle errors during Excel export', async () => {
      // Mock xlsx library to throw error
      jest.mock('xlsx', () => {
        throw new Error('XLSX error');
      });

      await expect(exportToExcel(mockData, 'test')).rejects.toThrow('Failed to export to Excel');
    });
  });
}); 