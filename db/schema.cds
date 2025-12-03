namespace CDSProject;

entity Books  {
   key ID:              UUID            @description: 'Book ID';
   borrowerName:        String(50)      @description: `Borrower's ID`;
   bookTitle:           String(100)     @description: 'Book Title';
   authorName:          String(100)     @description: 'Author Name';
   readDate:            Date            @description: 'Date';
}

entity PRODUCTS {
    key ProductID:      UUID            @description: 'Product ID';
    ProductName:        String(100)     @description: 'Product Name';
    SupplierID:         String(100)     @description: 'Supplier ID';
    CategoryID:         String(100)     @description: 'Category ID';
    QuantityPerUnit:    String(100)     @description: 'Quantity per unit';
    UnitPrice:          String(100)     @description: 'Unit Price';
    UnitsInStock:       Integer         @description: 'Units in Price';
    UnitsOnOrder:       Integer         @description: 'Units on Order';
    ReorderLevel:       Integer         @description: 'Reorder Level';
    Discontinued:       String          @description: 'Discontinued';
}

entity SUPPLIERS {
    SupplierID:         UUID            @description: 'Supplier ID';
    CompanyName:        String(100)     @description: 'Company Name';
    ContactName:        String(100)     @description: 'Contact Name';
    ContactTitle:       String(100)     @description: 'Contact Title';
    Address:            String(100)     @description: 'Address';
    City:               String(100)     @description: 'City';
    Region:             String(100)     @description: 'Region';
    PostalCode:         String(100)     @description: 'Postal Code';
    Country:            String(100)     @description: 'Country';
    Phone:              String(100)     @description: 'Phone';
    Fax:                Integer         @description: 'Fax';
    HomePage:           String(200)     @description: 'Home Page';
}

entity CATEGORIES {
    CategoryID:         String          @description: 'Category ID';
    CategoryName:       String          @description: 'Category Name';
    Description:        String          @description: 'Category Description';
}