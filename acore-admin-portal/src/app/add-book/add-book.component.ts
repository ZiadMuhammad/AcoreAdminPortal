import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService, Book } from '../book.service';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.css'],
})
export class AddBookComponent {
  bookForm: FormGroup;
  categories: string[] = ['Category 1', 'Category 2', 'Category 3'];
  previousVersions: string[] = ['Version 1', 'Version 2', 'Version 3'];

  constructor(private formBuilder: FormBuilder, private router: Router, private bookService: BookService) {
    this.bookForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      author: ['', [Validators.required]],
      category: ['', Validators.required],
      price: ['', [Validators.required, Validators.pattern(/^\d+(\.\d{1,2})?$/)]],
      version: ['', [Validators.required]],
      olderVersion: [''],
      edition: [''],
      isbn: ['', [Validators.required, Validators.pattern(/^[\d-]{0,13}$/)]],
      releaseDate: [''],
      brief: ['', [Validators.required, Validators.maxLength(800)]],
      coverPhoto: ['', Validators.required],
    });
  }


  saveBook(): void {
    if (this.bookForm.invalid) {
      this.markFormGroupTouched(this.bookForm);
      return;
    }
  
    const newBook: Book = {
      title: this.bookForm.value.title,
      author: this.bookForm.value.author,
      category: this.bookForm.value.category,
      price: this.bookForm.value.price,
      version: this.bookForm.value.version,
      olderVersion: this.bookForm.value.olderVersion,
      edition: this.bookForm.value.edition,
      isbn: this.bookForm.value.isbn,
      releaseDate: this.bookForm.value.releaseDate,
      brief: this.bookForm.value.brief,
      coverPhoto: this.bookForm.value.coverPhoto
    };
  
    this.bookService.addBook(newBook);  
    this.router.navigate(['/dashboard']);
  }

  onSubmit() {
    console.log("Book saved.");
    this.saveBook();
  }

  cancel(): void {
    this.router.navigate(['/dashboard']);
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
  
  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}
