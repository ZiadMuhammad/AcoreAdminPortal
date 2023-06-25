import { Component, OnInit, ViewChild } from '@angular/core';
import { BookService, Book } from '../book.service';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: MatTableDataSource<Book> = new MatTableDataSource<Book>([]);
  searchQuery: string = '';

  pageSize: number = 6;
  pageIndex: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private bookService: BookService, private router: Router, private dialog: MatDialog) {}

  openDeleteDialog(isbn: string): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '300px',
      data: isbn
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.deleteBook(isbn);
      }
    });
  }
  
  ngOnInit(): void {
    this.loadBooks();
  }

  ngAfterViewInit(): void {
    this.filteredBooks.paginator = this.paginator;
  }

  loadBooks(): void {
    this.books = this.bookService.getBooks();
    this.filteredBooks = new MatTableDataSource<Book>(this.books);
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredBooks.filter = this.searchQuery.trim().toLowerCase();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  viewBookDetails(isbn: string): void {
    this.router.navigate(['/viewbook', isbn]);
  }

  editBookDetails(isbn: string): void {
    this.router.navigate(['/editbook', isbn]);
  }

  addBook(): void {
    this.router.navigate(['/addbook']);
  }

  deleteBook(isbn: string): void {
    this.bookService.deleteBook(isbn);
    this.loadBooks();
  }

  filterBooks(): void {
    const lowerCaseQuery = this.searchQuery.toLowerCase();
    this.filteredBooks.data = this.books.filter((book) =>
      book.title.toLowerCase().includes(lowerCaseQuery) ||
      book.category.toLowerCase().includes(lowerCaseQuery) ||
      book.author.toLowerCase().includes(lowerCaseQuery) ||
      book.isbn.toLowerCase().includes(lowerCaseQuery) ||
      book.version.toLowerCase().includes(lowerCaseQuery)
    );
  }
}
