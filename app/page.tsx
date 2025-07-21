'use client';

import React, { useState, useMemo } from 'react';
import { Upload, Download, Filter, Search, DollarSign, Users, User, Shield, FileText, Clock, CheckCircle } from 'lucide-react';

interface Transaction {
  id: number;
  postedDate: string;
  referenceNumber: string;
  payee: string;
  address: string;
  amount: number;
  category: 'splitwise' | 'personal' | 'uncategorized';
}

export default function TransactionCategorizer() {
  const [showApp, setShowApp] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<string>('all'); // all, splitwise, personal, uncategorized
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('date');
  const [sortOrder, setSortOrder] = useState<string>('desc');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());

      const parsedTransactions: Transaction[] = lines.slice(1)
        .filter(line => line.trim())
        .map((line, index) => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          return {
            id: index,
            postedDate: values[0],
            referenceNumber: values[1],
            payee: values[2],
            address: values[3],
            amount: parseFloat(values[4]) || 0,
            category: 'uncategorized' as const
          };
        });

      setTransactions(parsedTransactions);
    } catch (error) {
      alert('Error parsing CSV file. Please make sure it\'s in the correct format.');
    }
  };

  const updateCategory = (id: number, category: 'splitwise' | 'personal' | 'uncategorized') => {
    setTransactions(prev =>
      prev.map(t => t.id === id ? { ...t, category } : t)
    );
  };

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions;

    // Apply filter
    if (filter !== 'all') {
      filtered = filtered.filter(t => t.category === filter);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(t =>
        t.payee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;
      switch (sortBy) {
        case 'date':
          aVal = new Date(a.postedDate);
          bVal = new Date(b.postedDate);
          break;
        case 'amount':
          aVal = Math.abs(a.amount);
          bVal = Math.abs(b.amount);
          break;
        case 'payee':
          aVal = a.payee.toLowerCase();
          bVal = b.payee.toLowerCase();
          break;
        default:
          aVal = a[sortBy as keyof Transaction];
          bVal = b[sortBy as keyof Transaction];
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [transactions, filter, searchTerm, sortBy, sortOrder]);

  const summary = useMemo(() => {
    const splitwise = transactions.filter(t => t.category === 'splitwise');
    const personal = transactions.filter(t => t.category === 'personal');
    const uncategorized = transactions.filter(t => t.category === 'uncategorized');

    return {
      splitwise: {
        count: splitwise.length,
        total: splitwise.reduce((sum, t) => sum + Math.abs(t.amount), 0)
      },
      personal: {
        count: personal.length,
        total: personal.reduce((sum, t) => sum + Math.abs(t.amount), 0)
      },
      uncategorized: {
        count: uncategorized.length,
        total: uncategorized.reduce((sum, t) => sum + Math.abs(t.amount), 0)
      }
    };
  }, [transactions]);

  const exportCategorizedData = () => {
    const csvContent = [
      'Posted Date,Reference Number,Payee,Address,Amount,Category',
      ...transactions.map(t =>
        `${t.postedDate},${t.referenceNumber},"${t.payee}","${t.address}",${t.amount},${t.category}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'categorized_transactions.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatAmount = (amount: number) => {
    const formatted = Math.abs(amount).toFixed(2);
    return amount < 0 ? `-${formatted}` : `${formatted}`;
  };

  // Homepage component
  if (!showApp) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
          <div className="text-center mb-16">
            <div className="flex justify-center items-center mb-6">
              <div className="bg-blue-600 rounded-full p-3 mr-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
                Transaction Categorizer
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              The secure way to categorize your credit card transactions for Splitwise without compromising your financial data
            </p>
            <button
              onClick={() => setShowApp(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started - Upload Your CSV
            </button>
          </div>

          {/* Problem & Solution */}
          <div className="grid md:grid-cols-2 gap-12 mb-16">
            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-red-100 rounded-full p-2 mr-3">
                  <Shield className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">The Problem</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                You want to split expenses with friends using Splitwise, but manually going through hundreds of credit card transactions is a nightmare.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Most expense apps want you to connect your bank account directly through services like Plaid, but that means sharing your financial credentials with third parties—creating unnecessary security risks.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-100">
              <div className="flex items-center mb-4">
                <div className="bg-green-100 rounded-full p-2 mr-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">The Solution</h2>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">
                Simply export your credit card transactions as a CSV file (available from any bank's website) and upload it here. No bank connections, no stored data, no security risks.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Easily categorize each transaction as "Splitwise" or "Personal" with intuitive one-click buttons, then export your categorized data.
              </p>
            </div>
          </div>

          {/* Security & Privacy */}
          <div className="bg-blue-50 rounded-xl p-8 mb-16 border border-blue-200">
            <div className="flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-blue-600 mr-3" />
              <h2 className="text-3xl font-bold text-gray-900">Security & Privacy First</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="bg-white rounded-lg p-4 mb-3 mx-auto w-16 h-16 flex items-center justify-center">
                  <Upload className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">CSV Upload Only</h3>
                <p className="text-gray-600 text-sm">Your data never leaves your browser. No bank account connections required.</p>
              </div>
              <div>
                <div className="bg-white rounded-lg p-4 mb-3 mx-auto w-16 h-16 flex items-center justify-center">
                  <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">No Data Storage</h3>
                <p className="text-gray-600 text-sm">Nothing is saved to any server. Your financial data stays private.</p>
              </div>
              <div>
                <div className="bg-white rounded-lg p-4 mb-3 mx-auto w-16 h-16 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Session Only</h3>
                <p className="text-gray-600 text-sm">Data exists only during your session. Refresh the page and it's gone.</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="bg-white rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-blue-600">1</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Export from Bank</h3>
                <p className="text-gray-600 text-sm">Download your credit card transactions as a CSV file from your bank's website.</p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-blue-600">2</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Upload Securely</h3>
                <p className="text-gray-600 text-sm">Drag and drop your CSV file. Processing happens entirely in your browser.</p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-blue-600">3</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Categorize Easily</h3>
                <p className="text-gray-600 text-sm">Click "Splitwise" or "Personal" for each transaction. Search and filter to work efficiently.</p>
              </div>
              <div className="text-center">
                <div className="bg-white rounded-full p-4 mb-4 mx-auto w-16 h-16 flex items-center justify-center shadow-lg">
                  <span className="text-2xl font-bold text-blue-600">4</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Export Results</h3>
                <p className="text-gray-600 text-sm">Download your categorized transactions and easily add Splitwise expenses.</p>
              </div>
            </div>
          </div>

          {/* Expected CSV Format */}
          <div className="bg-gray-50 rounded-xl p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Expected CSV Format</h2>
            <div className="bg-white rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <div className="text-gray-500 mb-2">Your CSV should have these columns:</div>
              <div className="border rounded p-3">
                <div className="font-semibold text-blue-600">Posted Date,Reference Number,Payee,Address,Amount</div>
                <div className="text-gray-600 mt-1">01/15/2024,REF123,Chipotle Mexican Grill,123 Main St,-15.67</div>
                <div className="text-gray-600">01/16/2024,REF124,Uber,San Francisco CA,-32.45</div>
                <div className="text-gray-600">01/17/2024,REF125,Safeway,456 Oak Ave,-87.23</div>
              </div>
            </div>
            <p className="text-sm text-gray-600 mt-4 text-center">
              Most banks export in this format. If yours is different, you can easily adjust the columns in Excel or Google Sheets.
            </p>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <button
              onClick={() => setShowApp(true)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-12 rounded-lg text-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
            >
              Start Categorizing Your Transactions
            </button>
            <p className="text-gray-500 mt-4">No signup required • Completely free • Your data stays private</p>
          </div>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-500">
            <p>Built because connecting bank accounts to third-party services is unnecessary and risky.</p>
            <p className="mt-2">Your financial security matters more than convenience.</p>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-sm">
                This website was fully generated and built using{' '}
                <span className="font-semibold text-blue-600">Claude AI</span>{' '}
                by{' '}
                <span className="font-semibold text-gray-700">Krish Suraparaju</span>
              </p>
            </div>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Credit Card Transaction Categorizer
          </h1>
          <button
            onClick={() => setShowApp(false)}
            className="text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            ← Back to Home
          </button>
        </div>

        {/* File Upload */}
        <div className="mb-6">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-4 text-gray-500" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> your CSV file
              </p>
              <p className="text-xs text-gray-500">CSV files only</p>
            </div>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {transactions.length > 0 && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center">
                  <Users className="w-6 h-6 text-blue-600 mr-2" />
                  <div>
                    <p className="text-sm text-blue-600 font-medium">Splitwise</p>
                    <p className="text-lg font-bold text-blue-800">{summary.splitwise.count}</p>
                    <p className="text-sm text-blue-600">${summary.splitwise.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <User className="w-6 h-6 text-green-600 mr-2" />
                  <div>
                    <p className="text-sm text-green-600 font-medium">Personal</p>
                    <p className="text-lg font-bold text-green-800">{summary.personal.count}</p>
                    <p className="text-sm text-green-600">${summary.personal.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-center">
                  <Filter className="w-6 h-6 text-gray-600 mr-2" />
                  <div>
                    <p className="text-sm text-gray-600 font-medium">Uncategorized</p>
                    <p className="text-lg font-bold text-gray-800">{summary.uncategorized.count}</p>
                    <p className="text-sm text-gray-600">${summary.uncategorized.total.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center">
                  <DollarSign className="w-6 h-6 text-purple-600 mr-2" />
                  <div>
                    <p className="text-sm text-purple-600 font-medium">Total</p>
                    <p className="text-lg font-bold text-purple-800">{transactions.length}</p>
                    <p className="text-sm text-purple-600">
                      ${(summary.splitwise.total + summary.personal.total + summary.uncategorized.total).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Search className="w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search payee or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Transactions</option>
                <option value="splitwise">Splitwise Only</option>
                <option value="personal">Personal Only</option>
                <option value="uncategorized">Uncategorized Only</option>
              </select>

              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date-desc">Date (Newest First)</option>
                <option value="date-asc">Date (Oldest First)</option>
                <option value="amount-desc">Amount (Highest First)</option>
                <option value="amount-asc">Amount (Lowest First)</option>
                <option value="payee-asc">Payee (A-Z)</option>
                <option value="payee-desc">Payee (Z-A)</option>
              </select>

              <button
                onClick={exportCategorizedData}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
            </div>

            {/* Transactions Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payee</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {transaction.postedDate}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 font-medium">
                        {transaction.payee}
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {transaction.address}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={transaction.amount < 0 ? 'text-red-600' : 'text-green-600'}>
                          {formatAmount(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateCategory(transaction.id, 'splitwise')}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              transaction.category === 'splitwise'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                            }`}
                          >
                            Splitwise
                          </button>
                          <button
                            onClick={() => updateCategory(transaction.id, 'personal')}
                            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                              transaction.category === 'personal'
                                ? 'bg-green-100 text-green-800 border border-green-300'
                                : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                            }`}
                          >
                            Personal
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredAndSortedTransactions.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No transactions match your current filters.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}