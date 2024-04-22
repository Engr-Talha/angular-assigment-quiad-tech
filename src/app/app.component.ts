import { Component, ElementRef, OnInit } from '@angular/core';
import { generate } from '@pdfme/generator';
import { Form, Viewer, Designer } from '@pdfme/ui';
import { invoiceTemplate } from './templates/invoiceTemplate';
import { getCertificateTemplate } from './templates/getCertificateTemplate';
import {
  text,
  readOnlyText,
  barcodes,
  image,
  readOnlyImage,
  svg,
  readOnlySvg,
  line,
  tableBeta,
  rectangle,
  ellipse,
} from '@pdfme/schemas';

import {
  Template,
  Font,
  checkTemplate,
  getInputFromTemplate,
} from '@pdfme/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private elementRef: ElementRef) {}
  templateOptions: string[] = ['Invoice Template', 'Certificate Template 2'];
  selectedTemplate: any;
  selectedOption: string | undefined;
  ngOnInit(): void {
    const domContainer =
      this.elementRef.nativeElement.querySelector('#pdfme-container');

    const inputs = [{ a: 'a1', b: 'b1', c: 'c1' }];

    const designer = new Designer({
      domContainer,
      template: invoiceTemplate,
    });
  }

  onTemplateSelected(event: Event): void {
    const target = event.target as HTMLSelectElement;
    if (target) {
      const template = target.value;

      this.selectedTemplate = template;
      const domContainer =
        this.elementRef.nativeElement.querySelector('#pdfme-container');
      let selectedTemplate;

      switch (template) {
        case 'Invoice Template':
          selectedTemplate = invoiceTemplate;
          // this.selectedTemplate = invoiceTemplate;

          break;
        case 'Certificate Template 2':
          selectedTemplate = getCertificateTemplate;
          // this.selectedTemplate = getCertificateTemplate;

          break;
        default:
          console.error('Invalid template option selected');
          return;
      }

      const designer = new Designer({
        domContainer,
        template: selectedTemplate,
      });
    }
  }
  onSelect(option: string): void {
    this.selectedOption = option;
  }

  genPDF(): void {
    this.selectedTemplate = invoiceTemplate;
    const inputs =
      typeof (this.selectedTemplate as Viewer | Form).getInputs === 'function'
        ? (this.selectedTemplate as Viewer | Form).getInputs()
        : getInputFromTemplate(this.selectedTemplate);

    generate({
      template: this.selectedTemplate,
      inputs,
      plugins: this.getPlugins(),
    }).then((pdf) => {
      const blob = new Blob([pdf.buffer], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(blob);
      const newWindow = window.open(pdfUrl, '_blank');
      if (newWindow) {
        newWindow.onload = () => {
          newWindow.print();
        };
      } else {
        console.error('Failed to open new window for printing');
      }
    });
  }

  getPlugins() {
    return {
      Text: text,
      ReadOnlyText: readOnlyText,
      Table: tableBeta,
      Line: line,
      Rectangle: rectangle,
      Ellipse: ellipse,
      Image: image,
      ReadOnlyImage: readOnlyImage,
      SVG: svg,
      ReadOnlySvg: readOnlySvg,
      QR: barcodes.qrcode,
      Code128: barcodes.code128,
    };
  }
}
