import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {TransactionResponse} from '../../model/transaction/transaction.response';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'ngx-pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.scss'],
})
export class PdfComponent implements OnInit {
  name: number = null;
  transactionResponse: TransactionResponse = null;

  constructor(@Inject(MAT_DIALOG_DATA) private data) {
    this.transactionResponse = this.data.transaction;
    this.name = this.transactionResponse.id;
  }

  ngOnInit(): void {
  }

  public downloadAsPDF() {

    const div = document.getElementById('content');
    const options = {
      background: 'white',
      scale: 2,
    };

    html2canvas(div, options).then((canvas) => {

      const img = canvas.toDataURL('image/PNG');
      const doc = new jsPDF('l', 'mm', 'a4', 1);

      // Add image Canvas to PDF
      const bufferX = 5;
      const bufferY = 5;
      const imgProps = (<any>doc).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');

      return doc;
    }).then((doc) => {
      doc.save('HoadonID_' + this.name + '.pdf');
    });
  }
}
