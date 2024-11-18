import { Component, ViewChild, OnInit, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import Quill from "quill";
import { NgModule } from '@angular/core';
import { CommonModule,isPlatformBrowser  } from '@angular/common';
@Component({
  selector: 'app-quan-ly-bookings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quan-ly-booking.component.html',
  styleUrls: ['./quan-ly-booking.component.scss']
})
export class QuanLyBookingComponent implements OnInit {
  @ViewChild('editorContainer', { static: false }) editorContainer: ElementRef | null = null;
  editor: any;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const Quill = (await import('quill')).default;
      this.initializeEditor(Quill);
    }
  }

  initializeEditor(Quill: any) {
    if (this.editorContainer) {
      this.editor = new Quill(this.editorContainer.nativeElement, {
        modules: {
          toolbar: [
            [{ header: [1, 2, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image', 'video'],
            [{ align: [] }],
            [{ color: [] }, { background: [] }],
            ['clean'],
          ],
        },
        theme: 'snow',
      });
    }
  }

  getEditorContent() {
    return this.editor ? this.editor.root.innerHTML : '';
  }

}
