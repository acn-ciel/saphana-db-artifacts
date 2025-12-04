const cds = require('@sap/cds');
const { SELECT } = require('@sap/cds/lib/ql/cds-ql');

async  function FetchBooks(borrowerName) {
    try {

        const  txInsert = await cds.transaction();

        const records = await txInsert.run(
            SELECT.from('CDSPROJECT_BOOKS')
                .where({ borrowerName })
                .orderBy({ borrowerName: 'desc' })
        )

        if (!records || records.length === 0) {
            return `There is no borrowed books for borrower ${borrowerName}`
        }

        // Return the fetched values
        return {
            records
        };
        
    }  catch (error) {
        return { MESSAGE: error.message };
    }
}

module.exports = {
    FetchBooks
}