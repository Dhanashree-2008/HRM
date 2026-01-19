import React, { useState } from 'react';
import {
  FiFileText,
  FiFile,
  FiDownload,
  FiUpload,
  FiX,
  FiCheck,
  FiAlertCircle
} from 'react-icons/fi';
import { FaRegFilePdf, FaRegFileExcel, FaRegFileWord } from 'react-icons/fa';

const ExportMenu = ({ 
  onExportPDF, 
  onExportExcel, 
  onExportJSON, 
  onExportWord,
  onImport,
  onClose 
}) => {
  const [importMode, setImportMode] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [importError, setImportError] = useState(null);

  const exportOptions = [
    {
      id: 'pdf',
      name: 'Export as PDF',
      description: 'Professional report with formatting',
      icon: <FaRegFilePdf className="w-5 h-5 text-red-500" />,
      action: onExportPDF,
      formats: ['.pdf']
    },
    {
      id: 'excel',
      name: 'Export as Excel',
      description: 'Spreadsheet with all data',
      icon: <FaRegFileExcel className="w-5 h-5 text-green-500" />,
      action: onExportExcel,
      formats: ['.xlsx', '.xls', '.csv']
    },
    {
      id: 'json',
      name: 'Export as JSON',
      description: 'Complete data backup',
      icon: <FiFileText className="w-5 h-5 text-yellow-500" />,
      action: onExportJSON,
      formats: ['.json']
    },
    {
      id: 'word',
      name: 'Export as Word',
      description: 'Editable document format',
      icon: <FaRegFileWord className="w-5 h-5 text-blue-500" />,
      action: onExportWord,
      formats: ['.docx', '.doc']
    }
  ];

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setImportError(null);

    // Validate file
    const isValid = validateImportFile(file, selectedFormat);
    if (!isValid) {
      setImportError('Invalid file format or size');
      return;
    }

    try {
      await onImport(file);
      setImportMode(false);
      onClose();
    } catch (error) {
      setImportError(`Import failed: ${error.message}`);
    }
  };

  const validateImportFile = (file, format) => {
    const maxSize = 10 * 1024 * 1024; // 10MB
    const validFormats = {
      excel: ['.xlsx', '.xls', '.csv'],
      json: ['.json'],
      all: ['.xlsx', '.xls', '.csv', '.json', '.pdf', '.docx', '.doc']
    };

    if (file.size > maxSize) {
      return false;
    }

    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    const allowedFormats = validFormats[format] || validFormats.all;
    
    return allowedFormats.includes(extension);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-bold text-gray-900">
            {importMode ? 'Import Data' : 'Export Data'}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {importMode ? (
            /* Import Mode */
            <div className="space-y-4">
              <div className="text-center py-4 border-2 border-dashed border-gray-300 rounded-lg">
                <FiUpload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-2">Drag & drop or click to upload</p>
                <p className="text-sm text-gray-500 mb-4">
                  Supports: .xlsx, .xls, .csv, .json (max 10MB)
                </p>
                <label className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700">
                  Select File
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileSelect}
                    accept=".xlsx,.xls,.csv,.json"
                  />
                </label>
              </div>

              {importError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FiAlertCircle className="w-5 h-5 text-red-500" />
                    <p className="text-sm text-red-700">{importError}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setImportMode(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => document.querySelector('input[type="file"]').click()}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Browse Files
                </button>
              </div>
            </div>
          ) : (
            /* Export Mode */
            <div className="space-y-4">
              {exportOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={option.action}
                  className="w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <div className="flex-shrink-0">
                    {option.icon}
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-medium text-gray-900">{option.name}</p>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                  <FiDownload className="w-5 h-5 text-gray-400" />
                </button>
              ))}

              <div className="pt-4 border-t">
                <button
                  onClick={() => setImportMode(true)}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400"
                >
                  <FiUpload className="w-5 h-5" />
                  Import Data
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExportMenu;