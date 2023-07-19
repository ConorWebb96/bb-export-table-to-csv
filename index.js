require('dotenv').config();
const cliProgress = require('cli-progress');
const fetch = require('isomorphic-fetch');
const fs = require('fs');
// env vars
const budibaseAPIKey = process.env.BUDIBASE_API_KEY;
const appID = process.env.APP_ID;
const tableID = process.env.TABLE_ID;
const callLimit = process.env.LIMIT;
const hostingURL = process.env.HOSTING_URL;

const progressBar = new cliProgress.SingleBar({
  format: 'Fetching rows... | {bar} | {percentage}% | {value} Rows',
  barCompleteChar: '\u2588',
  barIncompleteChar: '\u2591',
  hideCursor: true
});

const options = { // budibase options for fetching rows
  method: 'POST',
  headers: {
    accept: 'application/json',
    'x-budibase-app-id': appID,
    'content-type': 'application/json',
    'x-budibase-api-key': budibaseAPIKey
  },
  body: JSON.stringify({ paginate: true, limit: callLimit })
};

function fetchRows(url, bookmark = null, accumulatedRows = []) {
  const requestBody = { paginate: true, limit: callLimit };

  if (bookmark) {
    requestBody.bookmark = bookmark;
  }

  const fetchOptions = {
    ...options,
    body: JSON.stringify(requestBody)
  };

  return fetch(url, fetchOptions)
    .then(response => {
      if (!response.ok) {
        throw new Error(`Failed to fetch rows. Status: ${response.status}`);
      }
      return response.json();
    })
    .then(response => {
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format. Data array not found.');
      }
      const rows = response.data;
      accumulatedRows.push(...rows);

      if (response.hasNextPage) {
        progressBar.start(response.totalCount, 0);
        progressBar.update(accumulatedRows.length);

        return fetchRows(url, response.bookmark, accumulatedRows); // Pass the bookmark for the next page
      } else {
        progressBar.stop();
        console.log(`All rows fetched. Converting to CSV...`);
        return accumulatedRows;
      }
    })
    .catch(err => {
      console.error('An error occurred while fetching rows:', err);
      throw err;
    });
}

function convertToCSV(rows) {
  const columns = new Set();

  rows.forEach(row => {
    Object.keys(row).forEach(column => {
      columns.add(`"${column}"`); // Wrap column names in double quotes
    });
  });

  const csvRows = [Array.from(columns).join(',')];

  rows.forEach(row => {
    const values = Array.from(columns).map(column => {
      const columnName = column.replace(/"/g, ''); // Remove double quotes from column name
      if (typeof row[columnName] === 'object' && row[columnName] !== null) { // Check if the value is an object and not null
        // return `"${row[columnName][0]._id}"`; // can't input relationships in imports so leave this out, re add later if it allowed
        return;
      } else {
        return row[columnName] !== undefined && row[columnName] !== null ? `"${row[columnName]}"` : ''; // Wrap value in double quotes only if it is defined
      }
    });
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
}

function saveToCSVFile(content, filename) {
  fs.writeFileSync(filename, content);
  console.log(`CSV file saved as ${filename}`);
}

const outputFilename = 'output.csv';

fetchRows(`${hostingURL}/api/public/v1/tables/${tableID}/rows/search`, null)
  .then(rows => {
    console.log(`Rows fetched: ${rows.length}`);
    const csvContent = convertToCSV(rows);
    saveToCSVFile(csvContent, outputFilename);
  })
  .catch(err => {
    console.error('An error occurred:', err);
  });