import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private books: Book[] = [];

  constructor() {
    // Check if books exist in local storage
    const storedBooks = localStorage.getItem('books');
    if (storedBooks) {
      this.books = JSON.parse(storedBooks);
    } else {
      // Sample data if no books in local storage
      this.books = [
        {
          title: 'Book 1',
          author: 'Author 1',
          category: 'Category 1',
          price: 10,
          coverPhoto: 'book1.jpg',
          version: '1.0',
          olderVersion: "Version 2",
          edition: 'First Edition',
          isbn: '131231234111',
          releaseDate: new Date(),
          brief: 'Brief description of Book 1'
        },
        {
          title: 'Book 2',
          author: 'Author 2',
          category: 'Category 2',
          price: 15,
          coverPhoto: 'book2.jpg',
          version: '1.0',
          olderVersion: "Version 3",
          edition: 'Second Edition',
          isbn: '12313123-3',
          releaseDate: new Date(),
          brief: 'Brief description of Book 2'
        }
      ];
      this.saveBooks();
    }
  }

  getBooks(): Book[] {
    return this.books;
  }

  getBookByISBN(isbn: string): Book | undefined {
    return this.books.find(book => book.isbn === isbn);
  }

  addBook(book: Book): void {
    this.books.push(book);
    this.saveBooks();
  }

  editBook(isbn: string, book: Book): void {
    const index = this.books.findIndex((b) => b.isbn === isbn);
    if (index !== -1) {
      this.books[index] = book;
      this.saveBooks();
    }
  }  

  deleteBook(isbn: string): void {
    const index = this.books.findIndex(book => book.isbn === isbn);
    if (index !== -1) {
      this.books.splice(index, 1);
      this.saveBooks();
    }
  }

  private saveBooks(): void {
    localStorage.setItem('books', JSON.stringify(this.books));
  }
}

export interface Book {
  title: string;
  author: string;
  category: string;
  price: number;
  coverPhoto: string;
  version: string;
  olderVersion: string;
  edition: string;
  isbn: string;
  releaseDate: Date;
  brief: string;
}
