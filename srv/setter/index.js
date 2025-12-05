const cdsCompile = require('@sap/cds/lib/compile/cds-compile');
const SELECT = require('@sap/cds/lib/ql/SELECT');
const INSERT = require('@sap/cds/lib/ql/INSERT');
const { v4: uuidv4 } = require('uuid');

async function LogBooks(borrowerName, bookTitle, authorName, readDate) {
    
    try {
        const  txInsert = await cds.transaction();

        const record = await txInsert.run(
            SELECT.one.from('CDSPROJECT_BOOKS')
                .where({ bookTitle, readDate })
        )

        if (record) {
            return `There is already an existing borrowed book: ${bookTitle}, which has date logged: ${readDate}`
        }

        await txInsert.begin();
        await txInsert.run(INSERT.into('CDSPROJECT_BOOKS').entries({
            ID: uuidv4(),
            borrowerName: borrowerName,
            bookTitle: bookTitle,
            authorName: authorName,
            readDate: readDate
        }))
        await txInsert.commit();

        return `Successfully inserted: Borrower Name: ${borrowerName}, Book Title: ${bookTitle}, Author Name: ${authorName}, Read date: ${readDate}`;
        
    } catch (error) {
        return { MESSAGE: error.message };
     }
};

module.exports = {
    LogBooks
}