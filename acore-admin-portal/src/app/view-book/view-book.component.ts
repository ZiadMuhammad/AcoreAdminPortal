import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Book, BookService } from '../book.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

@Component({
  selector: 'app-view-book',
  templateUrl: './view-book.component.html',
  styleUrls: ['./view-book.component.css']
})
export class ViewBookComponent implements OnInit {
  book: Book | undefined;
  isbn!: string;
  
  constructor(
    private route: ActivatedRoute,
    private bookService: BookService,
    private router: Router,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const isbn = params.get('isbn');
      if (isbn) {
        this.isbn = isbn;
        this.book = this.bookService.getBookByISBN(isbn);
      }
    });
  }

  openDeleteDialog(): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: this.book?.title
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'delete') {
        this.deleteBook();
        return;
      }
    });
  }

  deleteBook(): void {
    if (this.book && this.book.isbn) {
      this.bookService.deleteBook(this.book.isbn);
    }
    this.router.navigate(['/dashboard']);
  }

  editBook() {
    this.router.navigate(['/editbook', this.isbn]);
  }
}
