const cds = require('@sap/cds');
const { LogBooks } = require('../srv/setter/index');
const { FetchBooks } = require('../srv/getter/index');
const { executeHttpRequest } = require('@sap-cloud-sdk/http-client');
const { v4: uuidv4 } = require('uuid');

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

    srv.on('northwind', async (req) => {
        try {
            const response = await executeHttpRequest(
                {
                    destinationName: "northwind",
                },
                {
                    method: "GET",
                    url: "/V3/Northwind/Northwind.svc/Products?$format=json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
            );
            return response.data;
        } catch (error) {
            return { 'MESSAGE': error.message || error.toString() };
        }
    });

    srv.on('insertTBProducts', async (req) => {
        try {

            const response = await executeHttpRequest(
                { destinationName: "northwind" },
                {
                method: "GET",
                url: "https://services.odata.org/V3/Northwind/Northwind.svc/Products?$format=json",
                headers: { 'Content-Type': 'application/json' }
                }
            );

            const products = response.data?.value || [];

            if (!products.length) {
                return "No products found in Northwind service.";
            }

            // Step 2: Insert into HANA
            const tx = cds.transaction(req);

            for (const p of products) {
                await tx.run(
                INSERT.into('CDSPROJECT_PRODUCTS').entries({
                    ProductID:          String(p.ProductID),
                    ProductName:        String(p.ProductName),
                    SupplierID:         String(p.SupplierID),
                    CategoryID:         String(p.CategoryID),
                    QuantityPerUnit:    String(p.QuantityPerUnit),
                    UnitPrice:          String(p.UnitPrice),
                    UnitsInStock:       Number(p.UnitsInStock),
                    UnitsOnOrder:       Number(p.UnitsOnOrder),
                    ReorderLevel:       Number(p.ReorderLevel),
                    Discontinued:       String(p.Discontinued)
                })
                );
            }

            // Step 3: Return success message
            return `${products.length} supplier records successfully uploaded to the database.`;

            } catch (error) {
                return { MESSAGE: error.message || error.toString() };
            }
    });

    srv.on('insertTBSuppliers', async (req) => {
        try {

            const response = await executeHttpRequest(
                {
                    destinationName: "northwind",
                },
                {
                    method: "GET",
                    url: "https://services.odata.org/V3/Northwind/Northwind.svc/Suppliers?$format=json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
            );
            
            const suppliers = response.data?.value

            if (suppliers.length === 0 || !suppliers.length) {
                return "No products found in Northwind service"
            }

            const tx = cds.transaction(req);

            for (const s of suppliers) {
                await tx.run(
                    INSERT.into('CDSPROJECT_SUPPLIERS').entries({
                        SupplierID:     String(s.SupplierID),
                        CompanyName:    String(s.CompanyName),
                        ContactName:    String(s.ContactName),
                        ContactTitle:   String(s.ContactTitle),
                        Address:        String(s.Address),
                        City:           String(s.City),
                        Region:         String(s.Region),
                        PostalCode:     String(s.PostalCode),
                        Country:        String(s.Country),
                        Phone:          String(s.Phone),
                        Fax:            String(s.Fax),
                        HomePage:       String(s.HomePage)
                    })
                )
            }

            return `${suppliers.length} product records successfully uploaded to the database.`;
        } catch (error) {
            return { 'MESSAGE': error.message || error.toString() };
        }
    });

    srv.on('insertTBCategories', async (req) => {
        try {
            const response = await executeHttpRequest(
                {
                    destinationName: "northwind",
                },
                {
                    method: "GET",
                    url: "https://services.odata.org/V3/Northwind/Northwind.svc/Categories?$format=json",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                }
            );
            
            const categories = response.data?.value || [];

            if (!categories.length) {
                return "No products found in Northwind service.";
            }

            // Step 2: Insert into HANA
            const tx = cds.transaction(req);

            for (const c of categories) {
                await tx.run(
                INSERT.into('CDSPROJECT_CATEGORIES').entries({
                    CategoryID:          String(c.CategoryID),
                    CategoryName:        String(c.CategoryName),
                    Description:         String(c.Description),
                })
                );
            }

            // Step 3: Return success message
            return `${categories.length} category records successfully uploaded to the database.`;

        } catch (error) {
            return { 'MESSAGE': error.message || error.toString() };
        }
    });

    srv.on('fetchData', async (req) => {
    const tx = cds.transaction(req);
    const records = await tx.run(
        SELECT.from('CDSProject.PRODUCTS as P')
        .join('CDSProject.SUPPLIERS as S').on('P.SupplierID = S.SupplierID')
        .join('CDSProject.CATEGORIES as C').on('P.CategoryID = C.CategoryID')
        .columns(
            'P.ProductID',
            'P.ProductName',
            'P.SupplierID',
            'S.CompanyName',
            'S.Address',
            'S.City',
            'S.Region',
            'C.CategoryName',
            'C.Description'
        )
    );
    return records;
    });
};