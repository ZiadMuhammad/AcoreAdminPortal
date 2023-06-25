import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BookService, Book } from '../book.service';

@Component({
  selector: 'app-edit-book',
  templateUrl: './edit-book.component.html',
  styleUrls: ['./edit-book.component.css']
})
export class EditBookComponent implements OnInit {
  bookForm!: FormGroup;
  categories: string[] = ['Category 1', 'Category 2', 'Category 3'];
  previousVersions: string[] = ['Version 1', 'Version 2', 'Version 3'];
  isbn!: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    this.isbn = this.route.snapshot.paramMap.get('isbn') || '';  
    const book = this.bookService.getBookByISBN(this.isbn);
  
    this.bookForm = this.formBuilder.group({
      title: [book?.title || '', [Validators.required]],
      author: [book?.author || '', [Validators.required]],
      category: [book?.category || '', Validators.required],
      price: [book?.price || null, [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      version: [book?.version || '', [Validators.required]],
      olderVersion: [book?.olderVersion || ''],
      edition: [book?.edition || ''],
      isbn: [book?.isbn || '', [Validators.required, Validators.pattern(/^[\d-]{0,13}$/)]],
      releaseDate: [book?.releaseDate || ''],
      brief: [book?.brief || '', [Validators.required, Validators.maxLength(800)]],
      coverPhoto: [book?.coverPhoto || '', Validators.required],
    });
  }

  saveBook(): void {
    if (this.bookForm.invalid) {
      return;
    }

    const isbn = this.bookForm.controls['isbn'].value;
    const updatedBook: Book = {
      isbn: isbn,
      title: this.bookForm.controls['title'].value,
      author: this.bookForm.controls['author'].value,
      category: this.bookForm.controls['category'].value,
      price: this.bookForm.controls['price'].value,
      version: this.bookForm.controls['version'].value,
      olderVersion: this.bookForm.controls['olderVersion'].value,
      edition: this.bookForm.controls['edition'].value,
      releaseDate: this.bookForm.controls['releaseDate'].value,
      brief: this.bookForm.controls['brief'].value,
      coverPhoto: this.bookForm.controls['coverPhoto'].value
    };

    this.bookService.editBook(isbn, updatedBook);
    this.router.navigate(['/dashboard']);
  }

  onSubmit() {
    return;
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.bookForm.patchValue({
      coverPhoto: file ? file.name : ''
    });
    this.bookForm.get('coverPhoto')?.markAsTouched();
    this.bookForm.get('coverPhoto')?.markAsDirty();
  
    if (file) {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        console.log('File read successfully:', e.target.result);
      };
  
      reader.onerror = (e: any) => {
        console.error('Error reading file:', e.target.error);
      };
  
      reader.readAsDataURL(file);
    }
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
  }
}
