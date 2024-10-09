const express = require("express");
const Book = require("../models/Book"); // Import the Book model
const router = express.Router();

// Get all books with optional filters
router.get("/", async function (req, res) {
  try {
    const books = await Book.find({}); // Fetch all books from MongoDB

    let filters = {};
    filters.type = Array.from(arrayCheckboxes("category", books));
    filters.publishing_house = Array.from(
      arrayCheckboxes("publishing_house", books)
    );

    let selectedFilters = {
      search: req.query.search || "",
      sort: req.query.sort || "",
      category: req.query.category || [],
      price_range: req.query.price_range || "",
      minimum_rating: req.query.minimum_rating || 0,
      publishing_house: req.query.publishing_house || [],
      in_stock: req.query.stock_yes || false
    };

    // filter books array by query params
    let filterFunction = (item) =>
      searchProducts(item, req.query.search) &&
      getProductsByCategory(item, req.query.category) &&
      getProductsByPriceRange(item, req.query.price_range) &&
      getProductsByPublishingHouse(item, req.query.publishing_house) &&
      getProductsByRating(item, req.query.minimum_rating) &&
      getProductsByStock(item, req.query.stock_yes);

    let products = filterProducts(
      books,
      filterFunction,
      getSorted(req.query.sort)
    );

    res.status(200).json({
      products: products,
      filters: filters,
      selectedFilters: selectedFilters
    });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books", error });
  }
});

// Get book by ID
router.get("/:id", async function (req, res) {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).send({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book", error });
  }
});

// Get book by name
router.get("/name/:name", async function (req, res) {
  try {
    const book = await Book.findOne({ name: req.params.name });
    if (book) {
      res.status(200).json(book);
    } else {
      res.status(404).send({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error retrieving book", error });
  }
});



// Add a new book
router.post("/", async function (req, res) {
  try {
    const bookData = {
      name: req.body.name,
      author: req.body.author,
      category: req.body.category,
      publishing_house: req.body.publishing_house,
      price: Number(req.body.price),
      discount: Number(req.body.discount),
      quantity: Number(req.body.quantity),
      availability_date: req.body.availability_date,
      rating: Number(req.body.rating),
      image: req.body.image
    };

    if (validateProduct(bookData)) {
      const existingBook = await Book.findOne({
        name: bookData.name,
        category: bookData.category,
        author: bookData.author
      });

      if (existingBook) {
        return res.status(403).json({ message: "Book already exists" });
      }

      const newBook = new Book(bookData);
      await newBook.save();
      res.status(200).json({ message: "Book added successfully" });
    } else {
      res.status(400).json({ message: "Invalid book data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding book", error });
  }
});

// Update a book by ID
router.put("/:id", async function (req, res) {
  try {
    const updatedData = {
      name: req.body.name,
      author: req.body.author,
      category: req.body.category,
      publishing_house: req.body.publishing_house,
      price: Number(req.body.price),
      discount: Number(req.body.discount),
      quantity: Number(req.body.quantity),
      availability_date: req.body.availability_date,
      rating: Number(req.body.rating),
      image: req.body.image
    };

    if (validateProduct(updatedData)) {
      const updatedBook = await Book.findByIdAndUpdate(req.params.id, updatedData, {
        new: true
      });
      if (updatedBook) {
        res.status(200).json({ message: "Book updated successfully" });
      } else {
        res.status(404).json({ message: "Book not found" });
      }
    } else {
      res.status(400).json({ message: "Invalid book data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating book", error });
  }
});

// Delete a book by ID
router.delete("/:id", async function (req, res) {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (book) {
      res.status(200).json({ message: "Book deleted successfully" });
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting book", error });
  }
});

function validateProduct(product) {
  let regexProductName = /^[\w\-\s\,]+$/;
  let regexAuthor =
    /(^[a-zA-Z]{1,16})(\.{0,1})([ ]{0,1})([a-zA-Z]{1,16})(\.{0,1})([ ]{0,1})([a-zA-Z]{0,26})/;

  return (
    product.name &&
    product.author &&
    product.category &&
    product.publishing_house &&
    product.price &&
    product.quantity &&
    product.availability_date &&
    product.image &&
    product.name.match(regexProductName) &&
    product.name.length >= 1 &&
    product.name.length <= 50 &&
    product.category.match(regexProductName) &&
    product.category.length >= 2 &&
    product.category.length <= 30 &&
    product.author.match(regexAuthor) &&
    product.author.length >= 2 &&
    product.author.length <= 30 &&
    product.publishing_house.match(regexProductName) &&
    product.publishing_house.length >= 2 &&
    product.publishing_house.length <= 30 &&
    product.price > 0 &&
    product.discount >= 0 &&
    product.quantity >= 0 &&
    product.rating >= 0 &&
    product.rating <= 5 &&
    product.availability_date.length > 0
  );
}

//FUNCTIONS
function arrayCheckboxes(property, obj) {
  let propertySet = new Set();
  obj.forEach((product) => propertySet.add(product[property]));
  return propertySet;
}

function filterProducts(products, filterFunction, sortFunction) {
  if (filterFunction) {
    products = products.filter(filterFunction);
  }
  if (sortFunction) {
    products = products.sort(sortFunction);
  }
  return products;
}

function searchProducts(item, searchValue) {
  if (searchValue) {
    return (
      item.category.toLowerCase().includes(searchValue.toLowerCase()) ||
      item.name.toLowerCase().includes(searchValue.toLowerCase())
    );
  }
  return true;
}

// filter by categories
function getProductsByCategory(item, categories) {
  if (categories) {
    return categories.indexOf(item.category) !== -1;
  }
  return true;
}

// filter by price range
function getProductsByPriceRange(item, range) {
  let checkedPriceRange = [];
  if (range) {
    checkedPriceRange.push(range);
    checkedPriceRange = checkedPriceRange[0].split("_");
  }
  if (checkedPriceRange.length > 0) {
    if (checkedPriceRange.length === 1) {
      return item.price - item.discount >= checkedPriceRange[0];
    } else {
      return (
        item.price - item.discount >= checkedPriceRange[0] &&
        item.price - item.discount <= checkedPriceRange[1]
      );
    }
  }
  return true;
}

// filter by OS
function getProductsByPublishingHouse(item, publishing_house) {
  if (publishing_house) {
    return publishing_house.indexOf(item.publishing_house) !== -1;
  }
  return true;
}

// filter by minimum rating
function getProductsByRating(item, rating) {
  if (rating) {
    return item.rating >= rating;
  }
  return true;
}

// filter by available stock (change stock to zero to see effects)
function getProductsByStock(item, stock) {
  if (stock === "true") {
    return item.quantity > 0;
  }
  return true;
}

function getSorted(sort) {
  if (sort === "none") {
    return false;
  }
  if (sort === "asc") {
    return (a, b) => a.price - a.discount - (b.price - b.discount);
  } else if (sort === "desc") {
    return (a, b) => b.price - b.discount - (a.price - a.discount);
  }
}

module.exports = {
  router,
  getProductsByCategory,
  getProductsByPublishingHouse,
  searchProducts,
};