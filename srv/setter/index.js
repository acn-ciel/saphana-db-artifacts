const cdsCompile = require('@sap/cds/lib/compile/cds-compile');
const SELECT = require('@sap/cds/lib/ql/SELECT');
const { v4: uuidv4 } = require('uuid');

async function LogBooks(borrowerName, bookTitle, authorName, readDate) {
    
    const  txInsert = await cds.transaction();

    const record = await txInsert.run(
        SELECT.one.from('CDSPROJECT_BOOKS')
            .where({ bookTitle, readDate })
    )

    if (record) {
        return `There is already an existing borrowed book ${bookTitle} which has date logged on ${readDate}`
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

    return 'The data has been successfully inserted';
};

module.exports = {
    LogBooks
}