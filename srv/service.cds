using CDSProject as db from '../db/schema';

service CatalogService {
    entity Books as projection on db.Books;
    entity Products as projection on db.PRODUCTS;

    function northwind() returns String;

    action logBooks(borrowerName: String, bookTitle: String, authorName: String, readDate: Date) returns String;
    function fetchBooks(borrowerName: String) returns String;

    action insertTBProducts () returns String;
    action insertTBSuppliers () returns String;
    action insertTBCategories () returns String;

    function fetchData() returns array of {
        ProductID    : UUID;
        ProductName  : String;
        SupplierID   : String
        CompanyName  : String;
        Address      : String;
        City         : String;
        Region       : String;
        CategoryName : String;
        Description  : String;
    };
}