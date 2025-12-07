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

            const tx = cds.transaction(req);

            for (const p of products) {
                await tx.run(
                INSERT.into('CDSPROJECT_PRODUCTS').entries({
                    ProductID:        p.ProductID       != null ? String(p.ProductID)   : null,
                    ProductName:      p.ProductName     != null ? String(p.ProductName) : null,
                    SupplierID:       p.SupplierID      != null ? String(p.SupplierID)  : null,
                    CategoryID:       p.CategoryID      != null ? String(p.CategoryID)  : null,
                    QuantityPerUnit:  p.QuantityPerUnit != null ? String(p.QuantityPerUnit) : null,
                    UnitPrice:        p.UnitPrice       != null ? String(p.UnitPrice)   : null,
                    UnitsInStock:     p.UnitsInStock    != null ? Number(p.UnitsInStock) : null,
                    UnitsOnOrder:     p.UnitsOnOrder    != null ? Number(p.UnitsOnOrder) : null,
                    ReorderLevel:     p.ReorderLevel    != null ? Number(p.ReorderLevel) : null,
                    Discontinued:     p.Discontinued    != null ? String(p.Discontinued) : null

                })
                );
            }

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
                        SupplierID:   s.SupplierID   != null ? String(s.SupplierID)   : null,
                        CompanyName:  s.CompanyName  != null ? String(s.CompanyName)  : null,
                        ContactName:  s.ContactName  != null ? String(s.ContactName)  : null,
                        ContactTitle: s.ContactTitle != null ? String(s.ContactTitle) : null,
                        Address:      s.Address      != null ? String(s.Address)      : null,
                        City:         s.City         != null ? String(s.City)         : null,
                        Region:       s.Region       != null ? String(s.Region)       : null,
                        PostalCode:   s.PostalCode   != null ? String(s.PostalCode)   : null,
                        Country:      s.Country      != null ? String(s.Country)      : null,
                        Phone:        s.Phone        != null ? String(s.Phone)        : null,
                        Fax:          s.Fax          != null ? String(s.Fax)          : null,
                        HomePage:     s.HomePage     != null ? String(s.HomePage)     : null
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
                    CategoryID:     c.CategoryID   != null ? String(c.CategoryID)   : null,
                    CategoryName:   c.CategoryName != null ? String(c.CategoryName) : null,
                    Description:    c.Description  != null ? String(c.Description)  : null
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

    return records.map(r => ({
        ProductID: r.ProductID,
        ProductName: r.ProductName,
        SupplierID: r.SupplierID,
        CompanyName: r.CompanyName,
        Address: r.Address,
        City: r.City,
        Region: r.Region,
        CategoryName: r.CategoryName,
        Description: r.Description
        }));
    });
};