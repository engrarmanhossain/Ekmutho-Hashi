// Export utilities for CSV / Excel and Print

export const exportToCSV = (data, filename = 'ekmutho_hashi_export.csv') => {
  if (!data || !data.length) {
    alert('No data available to export.');
    return;
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);

  const csvRows = [];
  // Add header row
  csvRows.push(headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(','));

  // Add data rows
  for (const row of data) {
    const values = headers.map(header => {
      let val = row[header];
      if (val === null || val === undefined) val = '';
      if (typeof val === 'object') {
        val = JSON.stringify(val);
      }
      return `"${String(val).replace(/"/g, '""')}"`;
    });
    csvRows.push(values.join(','));
  }

  // UTF-8 BOM for Microsoft Excel compatibility with Unicode (Bengali text)
  const csvContent = '\uFEFF' + csvRows.join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const triggerPrint = () => {
  window.print();
};
