// img-preview.pipe.ts
import { Pipe, PipeTransform } from "@angular/core";
@Pipe({ name: "imgPreview", standalone: true })
export class ImgPreviewPipe implements PipeTransform {
  transform(file: File): any {
    return file ? URL.createObjectURL(file) : "";
  }
}
