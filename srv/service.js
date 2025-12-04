const cds = require('@sap/cds');
const { LogBooks } = require('../srv/setter/index');
const { FetchBooks } = require('../srv/getter/index');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');

module.exports = async srv => {
    
    srv.on('logBooks', async (req) => {
        const { borrowerName, bookTitle, authorName, readDate} = req.data;
        const result = await LogBooks(borrowerName, bookTitle, authorName, readDate);
        return result; // Returns a string
    })

    srv.on('fetchBooks', async (req) => {
        const { borrowerName } = req.data;
        const result = await FetchBooks(borrowerName);
        return result;
    })
};