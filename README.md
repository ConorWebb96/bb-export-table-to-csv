# Bb-export-table-to-csv
This is a readme explaining how to use this codebase to hook into the Budibase public API in order to export all rows of a table to a CSV.

# Requirements
* Node version 12 and above

# Setup
* Clone the repo.
   * `git clone` the repo.
   * `cd` to the folder its located.
   * `npm install` inside the repo.
   * Rename the file `.env-template` to `.env`.
* Get your Budibase API Key.
    * Login to your Budibase instance.
    * Click on your avatar at the top right of the page.
    * Click `View API Key`, a popup should occur.
    <img width="100%" alt="Screenshot 2023-07-13 at 14 39 54" src="https://github.com/ConorWebb96/bb-export-table-to-csv/assets/126772285/0d0537c7-e602-4c5b-a3a2-708ca85962e1">
    * Copy your API key from the window.
    <img width="100%" alt="Screenshot 2023-07-14 at 07 48 17" src="https://github.com/ConorWebb96/bb-export-table-to-csv/assets/126772285/5fad0973-2c52-41a3-80ed-a0d3c210b9d9">
    * Paste your API into `BUDIBASE_API_KEY` within the `.env` file.
* Get your appID.
    * Click into the app you wish to use this exporting codebase with.
    * Look for the URL and copy the part of the URL that looks similar to this; `app_dev_cloudtestbb_28a92365115s234925b0cb28af1a27a17542`
        * Paste your appID into `APP_ID` within the `.env` file.
* Get your tableID
    * Find the table you wish to export.
    * Look at the url after `table/` you should find your table id.
    * It should look something like this; `ta_3946749e5d814449bdd51a5ec37d58e2` if its an external db and not an internal table it should look like this instead: `datasource_plus_466537f1996c4d99add97f652378812b__posts_final`.
    * Paste your tableID into `TABLE_ID` within the `.env` file.

# Command
After you have finished with the setup process. Run the command `npm run export`, this should start a process in your terminal and export all your rows to a CSV file called `output.csv`. (The time it takes varies depending on size)

# Demo
![bb csv export public api](https://github.com/ConorWebb96/bb-export-table-to-csv/assets/126772285/035aecfa-cfab-4705-b158-2c6dcd0a381f)

# Limitation
You won't be able to export relationships, through testing I was able to pull the relevant _ids needed for relationships. However, when trying to re-import the CSV into the table again it ignored the relationship. **I may do additional testing to see if there is a workaround**

Find out more about [Budibase](https://github.com/Budibase/budibase).
