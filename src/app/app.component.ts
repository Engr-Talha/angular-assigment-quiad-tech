import { Component, ElementRef, OnInit } from '@angular/core';
import { generate } from '@pdfme/generator';
import { Form, Viewer, Designer } from '@pdfme/ui';
import { invoiceTemplate } from './templates/invoiceTemplate';
import { getCertificateTemplate } from './templates/getCertificateTemplate';
import { tabletemplate } from './templates/tabletemplate';
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
// import { Template } from '@pdfme/common/dist/types/src/schema';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private elementRef: ElementRef) {}
  templateOptions: string[] = [
    'Invoice Template',
    'Certificate Template',
    'Table Template',
  ];
  selectedTemplate: any;
  selectedOption: string | undefined;
  ngOnInit(): void {
    const domContainer =
      this.elementRef.nativeElement.querySelector('#pdfme-container');

    const inputs = [{ a: 'a1', b: 'b1', c: 'c1' }];

    const designer = new Designer({
      domContainer,
      template: tabletemplate,
      plugins: { Table: tableBeta },
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

        case 'Certificate Template':
          selectedTemplate = getCertificateTemplate;
          // this.selectedTemplate = getCertificateTemplate;
          break;

        case 'Table Template':
          selectedTemplate = tabletemplate;
          // this.selectedTemplate = getCertificateTemplate;

          break;
        default:
          console.error('Invalid template option selected');
          return;
      }

      const designer = new Designer({
        domContainer,
        template: selectedTemplate,
        plugins: this.getPlugins(),
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

  genJson() {
    const blob = new Blob([JSON.stringify(this.selectedTemplate)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${'temlate'}.json`;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  getTemplateFromJsonFile(event: any): Promise<Template> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const jsonStr = event.target?.result as string;
        const template2: Template = JSON.parse(jsonStr);
        checkTemplate(template2);
        resolve(template2);
        this.selectedTemplate = template2;
      };

      reader.onerror = (error) => {
        reject(error);
      };
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
