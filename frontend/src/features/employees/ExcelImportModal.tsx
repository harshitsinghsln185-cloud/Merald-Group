import React, { useState, useRef } from 'react';
import {
  FileSpreadsheet,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  X,
  FileText,
  AlertTriangle,
  RefreshCw,
  FolderOpen,
  Trash2,
} from 'lucide-react';
import * as XLSX from 'xlsx';
import { Modal } from '../../components/ui/Modal';
import { Button } from '../../components/ui/Button';
import { employeeService } from '../../services/employee.service';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onImportComplete?: () => void;
}

export const ExcelImportModal: React.FC<ExcelImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  onImportComplete,
}) => {
  const [step, setStep] = useState<'upload' | 'preview' | 'result'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [previewData, setPreviewData] = useState<{
    totalRows: number;
    validCount: number;
    invalidCount: number;
    rows: any[];
  } | null>(null);

  const [importResult, setImportResult] = useState<{
    importedCount: number;
    failedCount: number;
    failedRows: any[];
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleReset = () => {
    setStep('upload');
    setSelectedFile(null);
    setPreviewData(null);
    setImportResult(null);
    setErrorMsg('');
    setLoading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleDownloadTemplate = async () => {
    const downloaded = await employeeService.downloadImportTemplate();
    if (!downloaded) {
      const template = [
        {
          'Sr No': 1,
          'Employee Code': 'MGD-9101',
          'Employee Name': 'Alexander Wright',
          'Passport Number': 'A8492019X',
          'Designation': 'Senior Mechanical Engineer',
          'Site': 'Dubai Marina Project',
          'Basic Salary': 19500,
          'Payable Salary': 19500,
          'Month of Payable Salary': 'September 2026',
          'Account Number': 'AE100200000001928374651',
          'IFSC Code': 'ENBDUAE2DXXX',
          'Status': 'ACTIVE',
        },
        {
          'Sr No': 2,
          'Employee Code': 'MGD-9102',
          'Employee Name': 'Fatima Al-Zahra',
          'Passport Number': 'B7392018Y',
          'Designation': 'Site Safety Officer',
          'Site': 'Abu Dhabi Industrial Zone',
          'Basic Salary': 16000,
          'Payable Salary': 16000,
          'Month of Payable Salary': 'September 2026',
          'Account Number': 'AE900400000003829104820',
          'IFSC Code': 'FABIAEADXXX',
          'Status': 'ACTIVE',
        },
      ];
      const ws = XLSX.utils.json_to_sheet(template);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Employee Import Template');
      XLSX.writeFile(wb, 'Merald_Group_Employee_Import_Template.xlsx');
    }
  };

  const parseAndPreviewFile = async (file: File) => {
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Backend validation & parsing
      const res = await employeeService.previewImport(file);
      if (res && res.success && res.data) {
        setPreviewData(res.data);
        setStep('preview');
      } else {
        throw new Error(res?.message || 'Backend preview failed');
      }
    } catch (err: any) {
      // 2. Client-side SheetJS fallback parsing
      try {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
          throw new Error('The selected Excel workbook contains no worksheets.');
        }
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

        if (!rawRows || rawRows.length === 0) {
          throw new Error('The selected Excel sheet contains no data rows.');
        }

        const existing = await employeeService.getEmployees({ limit: 1000 });
        const existingList = existing.data || [];
        const dbCodes = new Set(existingList.map((e) => e.employeeCode.toUpperCase()));
        const dbPassports = new Set(existingList.map((e) => e.passportNumber.toUpperCase()));

        const seenCodes = new Set<string>();
        const seenPassports = new Set<string>();

        let validCount = 0;
        let invalidCount = 0;

        const previewRows = rawRows.map((row, idx) => {
          const rowNum = idx + 1;
          const errors: string[] = [];

          const srNo = Number(row['Sr No'] || row['srNo'] || rowNum);
          const employeeCode = String(row['Employee Code'] || row['employeeCode'] || '').trim().toUpperCase();
          const name = String(row['Employee Name'] || row['name'] || row['Name'] || '').trim();
          const passportNumber = String(row['Passport Number'] || row['passportNumber'] || '').trim().toUpperCase();
          const designation = String(row['Designation'] || row['designation'] || '').trim();
          const site = String(row['Site'] || row['site'] || '').trim();
          const basicSalary = Number(row['Basic Salary'] || row['basicSalary'] || 0);
          const payableSalary = Number(row['Payable Salary'] || row['payableSalary'] || 0);
          const payableMonth = String(row['Month of Payable Salary'] || row['Month'] || row['payableMonth'] || 'September 2026').trim();
          const accountNumber = String(row['Account Number'] || row['accountNumber'] || '').trim();
          const ifscCode = String(row['IFSC Code'] || row['IFSC'] || row['ifscCode'] || '').trim().toUpperCase();
          let status = String(row['Status'] || row['status'] || 'ACTIVE').trim().toUpperCase();

          if (status === 'ACTIVE' || status === 'ACTIVE') status = 'ACTIVE';
          else if (status === 'INACTIVE' || status === 'INACTIVE') status = 'INACTIVE';
          else if (status === 'LEAVE' || status === 'ON LEAVE' || status === 'LEAVE') status = 'LEAVE';

          if (!employeeCode) {
            errors.push('Employee Code is required');
          } else {
            if (dbCodes.has(employeeCode)) errors.push('Employee Code already exists');
            if (seenCodes.has(employeeCode)) errors.push('Duplicate Employee Code in file');
            seenCodes.add(employeeCode);
          }

          if (!name) errors.push('Employee Name is required');

          if (!passportNumber) {
            errors.push('Passport Number is required');
          } else {
            if (dbPassports.has(passportNumber)) errors.push('Passport Number already exists');
            if (seenPassports.has(passportNumber)) errors.push('Duplicate Passport Number in file');
            seenPassports.add(passportNumber);
          }

          if (!designation) errors.push('Designation is required');
          if (!site) errors.push('Site location is required');
          if (isNaN(basicSalary) || basicSalary <= 0) errors.push('Basic Salary must be positive');
          if (isNaN(payableSalary) || payableSalary <= 0) errors.push('Payable Salary is invalid');
          if (!['ACTIVE', 'INACTIVE', 'LEAVE'].includes(status)) errors.push('Status must be ACTIVE, INACTIVE or LEAVE');
          if (!accountNumber) errors.push('Account Number is required');
          if (!ifscCode) errors.push('IFSC Code is required');

          const isValid = errors.length === 0;
          if (isValid) validCount++;
          else invalidCount++;

          return {
            rowNum,
            srNo,
            employeeCode: employeeCode || `MGD-${Math.floor(1000 + Math.random() * 9000)}`,
            name,
            passportNumber,
            designation,
            site,
            basicSalary,
            payableSalary,
            payableMonth,
            accountNumber,
            ifscCode,
            status: isValid ? status : (status || 'ACTIVE'),
            isValid,
            errors,
          };
        });

        setPreviewData({
          totalRows: rawRows.length,
          validCount,
          invalidCount,
          rows: previewRows,
        });
        setStep('preview');
      } catch (fileErr: any) {
        setErrorMsg(fileErr.message || 'Please select a valid Excel file (.xlsx, .xls or .csv).');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['xlsx', 'xls', 'csv'];
    const validTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];

    const isValidExt = validExtensions.includes(ext || '');
    const isValidType = file.type ? validTypes.includes(file.type) || isValidExt : isValidExt;

    if (!isValidExt || !isValidType) {
      setErrorMsg('Please select a valid Excel file (.xlsx, .xls or .csv).');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('File size exceeds the 10MB limit.');
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setErrorMsg('');
    setSelectedFile(file);
    parseAndPreviewFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleConfirmSave = async () => {
    if (!previewData) return;

    const validRows = previewData.rows.filter((r) => r.isValid);
    if (validRows.length === 0) {
      setErrorMsg('No valid rows available to import.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await employeeService.confirmImport(validRows);
      if (res && res.success) {
        setImportResult({
          importedCount: res.data?.importedCount || validRows.length,
          failedCount: res.data?.failedCount || 0,
          failedRows: res.data?.failedRows || [],
        });
        setStep('result');
        onSuccess(`Successfully imported ${res.data?.importedCount || validRows.length} employees.`);
        if (onImportComplete) onImportComplete();
      } else {
        throw new Error(res?.message || 'Server failed to save records');
      }
    } catch (err: any) {
      // Fallback batch insert
      let count = 0;
      const failed: any[] = [];
      for (const row of validRows) {
        try {
          await employeeService.createEmployee({
            name: row.name,
            passportNumber: row.passportNumber,
            designation: row.designation,
            site: row.site,
            basicSalary: row.basicSalary,
            payableSalary: row.payableSalary,
            payableMonth: row.payableMonth,
            accountNumber: row.accountNumber,
            ifscCode: row.ifscCode,
            status: row.status,
          });
          count++;
        } catch (e: any) {
          failed.push({ rowNum: row.rowNum, name: row.name, reason: e.message || 'Error saving' });
        }
      }

      setImportResult({
        importedCount: count,
        failedCount: failed.length,
        failedRows: failed,
      });
      setStep('result');
      onSuccess(`Successfully imported ${count} employees.`);
      if (onImportComplete) onImportComplete();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Import Employees from Excel"
      icon={<FileSpreadsheet className="w-5 h-5 text-white" />}
      maxWidth="max-w-5xl lg:max-w-6xl w-full sm:w-[90vw]"
    >
      {errorMsg && (
        <div className="p-3.5 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="text-rose-400 hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Explicit Native File Input Element */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFileSelect(e.target.files[0]);
          }
        }}
      />

      {/* Step 1: Upload Step */}
      {step === 'upload' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-emerald-500/8 border border-emerald-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" /> Standard Excel Data Template
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                Download the official template to structure your employee columns accurately.
              </p>
            </div>
            <Button
              onClick={handleDownloadTemplate}
              variant="secondary"
              size="sm"
              className="shrink-0"
            >
              <Download className="w-4 h-4 text-emerald-400" /> Download Excel Template
            </Button>
          </div>

          {/* Dual Upload Container: Drag & Drop Dropzone + Native Browse Files Button */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all duration-200 flex flex-col items-center justify-center min-h-[260px] ${
              isDragging
                ? 'border-emerald-400 bg-emerald-500/15 scale-[0.99] shadow-[0_0_30px_rgba(16,185,129,0.2)]'
                : 'border-white/15 bg-[#091424]/60 hover:border-emerald-500/40'
            }`}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-sky-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-lg">
              <Upload className="w-8 h-8" />
            </div>

            <h4 className="text-base sm:text-lg font-extrabold text-white">Select Excel File</h4>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {isDragging ? (
                <strong className="text-emerald-400">Drop Excel file here to parse data!</strong>
              ) : (
                'Drag & Drop your Excel spreadsheet (.xlsx, .xls, .csv)'
              )}
            </p>

            <div className="flex items-center gap-3 my-4">
              <div className="h-px bg-white/10 w-20" />
              <span className="text-[11px] text-slate-500 font-bold uppercase">OR</span>
              <div className="h-px bg-white/10 w-20" />
            </div>

            {/* Native OS File Picker Trigger Button */}
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              variant="primary"
              size="md"
              className="shadow-xl py-3 px-6 text-sm font-bold"
            >
              <FolderOpen className="w-4 h-4 text-white" /> Choose Excel File
            </Button>

            <p className="text-[11px] text-slate-400 mt-4">
              Supported Formats: <strong className="text-slate-200">.xlsx, .xls, .csv</strong> (Max 10MB)
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/8 flex items-center justify-end gap-3">
            <Button onClick={handleClose} variant="secondary" size="md">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Step 2: Selected File Info & Import Preview Screen */}
      {step === 'preview' && (
        <div className="space-y-6">
          {/* Selected File Metadata Card */}
          {selectedFile && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    Excel File Loaded & Parsed
                  </span>
                  <h4 className="text-base font-extrabold text-white">{selectedFile.name}</h4>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    {(selectedFile.size / 1024).toFixed(1)} KB • {selectedFile.name.endsWith('.csv') ? 'CSV File' : 'Excel Spreadsheet'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="secondary"
                  size="sm"
                >
                  <FolderOpen className="w-4 h-4 text-emerald-400" /> Choose Another File
                </Button>
                <Button
                  onClick={handleReset}
                  variant="danger"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4" /> Remove File
                </Button>
              </div>
            </div>
          )}

          {previewData && (
            <>
              {/* Summary Metrics Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-white/4 border border-white/8">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Rows</span>
                  <span className="text-xl font-extrabold text-white">{previewData.totalRows}</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <span className="text-[10px] text-emerald-400 font-bold uppercase block">Ready to Import</span>
                  <span className="text-xl font-extrabold text-emerald-400">{previewData.validCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30">
                  <span className="text-[10px] text-rose-400 font-bold uppercase block">Invalid Rows</span>
                  <span className="text-xl font-extrabold text-rose-400">{previewData.invalidCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-sky-500/10 border border-sky-500/30">
                  <span className="text-[10px] text-sky-400 font-bold uppercase block">Data Status</span>
                  <span className="text-xs font-bold text-slate-200 mt-1 block">Parsed & Validated</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h4 className="text-sm font-extrabold text-white flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> EXCEL IMPORT PREVIEW TABLE
                </h4>
                <span className="text-xs text-slate-400">
                  Verify actual Excel rows before saving to database.
                </span>
              </div>

              {/* Preview Table */}
              <div className="enterprise-table-container max-h-80 overflow-y-auto">
                <table className="enterprise-table">
                  <thead>
                    <tr>
                      <th>Excel Row</th>
                      <th>Sr No</th>
                      <th>Emp Code</th>
                      <th>Employee Name</th>
                      <th>Passport No</th>
                      <th>Designation</th>
                      <th>Site</th>
                      <th>Basic Salary</th>
                      <th>Payable Salary</th>
                      <th>Month</th>
                      <th>Account No</th>
                      <th>IFSC</th>
                      <th>Status</th>
                      <th>Validation Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previewData.rows.map((r, i) => (
                      <tr
                        key={i}
                        className={!r.isValid ? 'bg-rose-500/8 hover:bg-rose-500/12' : ''}
                      >
                        <td className="font-mono text-slate-400 text-xs">#{r.rowNum}</td>
                        <td className="font-mono text-slate-400 text-xs">{r.srNo}</td>
                        <td className="font-mono font-bold text-emerald-400 text-xs">{r.employeeCode}</td>
                        <td className="font-bold text-white text-xs">{r.name || '—'}</td>
                        <td className="font-mono text-slate-300 text-xs">{r.passportNumber || '—'}</td>
                        <td className="text-slate-300 text-xs">{r.designation || '—'}</td>
                        <td className="text-slate-400 text-xs">{r.site || '—'}</td>
                        <td className="text-slate-300 text-xs">${r.basicSalary || 0}</td>
                        <td className="font-bold text-emerald-400 text-xs">${r.payableSalary || 0}</td>
                        <td className="text-slate-400 text-xs">{r.payableMonth}</td>
                        <td className="font-mono text-slate-300 text-xs">{r.accountNumber || '—'}</td>
                        <td className="font-mono text-slate-300 text-xs">{r.ifscCode || '—'}</td>
                        <td>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-white">
                            {r.status}
                          </span>
                        </td>
                        <td>
                          {r.isValid ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                              <CheckCircle2 className="w-3 h-3" /> Ready to Import
                            </span>
                          ) : (
                            <div className="space-y-1">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/15 text-rose-400 border border-rose-500/30">
                                <AlertTriangle className="w-3 h-3" /> Invalid Row
                              </span>
                              <div className="text-[10px] text-rose-400 font-semibold space-y-0.5">
                                {r.errors.map((err: string, ei: number) => (
                                  <p key={ei}>• {err}</p>
                                ))}
                              </div>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Footer */}
              <div className="pt-4 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Button onClick={() => fileInputRef.current?.click()} variant="secondary" size="md">
                  <RefreshCw className="w-4 h-4" /> Choose Another File
                </Button>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <Button onClick={handleClose} variant="ghost" size="md">
                    Cancel Import
                  </Button>
                  <Button
                    onClick={handleConfirmSave}
                    disabled={previewData.validCount === 0 || loading}
                    variant="primary"
                    size="md"
                    className="shadow-lg"
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Saving Records to MongoDB...</span>
                      </div>
                    ) : (
                      <>Confirm & Save Import ({previewData.validCount} Valid Rows)</>
                    )}
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Step 3: Result Summary Screen */}
      {step === 'result' && importResult && (
        <div className="space-y-6 text-center py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 mx-auto shadow-2xl">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-2xl font-extrabold text-white">Excel Import Completed!</h3>
            <p className="text-xs text-slate-400 mt-1">
              The employee records have been saved into the unified MongoDB dataset.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 max-w-md mx-auto space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300 font-semibold">Successfully Imported:</span>
              <span className="font-extrabold text-emerald-400 text-sm">{importResult.importedCount} Employees</span>
            </div>
            {importResult.failedCount > 0 && (
              <div className="flex items-center justify-between text-rose-400 pt-2 border-t border-emerald-500/20">
                <span className="font-semibold">Skipped / Failed:</span>
                <span className="font-extrabold text-sm">{importResult.failedCount} Rows</span>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/8 flex items-center justify-center">
            <Button onClick={handleClose} variant="primary" size="md">
              Done & Return to Dashboard
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

