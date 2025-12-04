using CDSProject as db from '../db/schema';

service CatalogService {
    entity Books as projection on db.Books;

    function northwind() returns String;

    action logBooks(borrowerName: String, bookTitle: String, authorName: String, readDate: Date) returns String;
    action fetchBooks(borrowerName: String) returns String;
}