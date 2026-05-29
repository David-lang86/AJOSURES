import jsPDF from 'jspdf'

export const generateReceipt =
  (
    transaction
  ) => {

    const doc =
      new jsPDF()

    doc.setFontSize(22)

    doc.text(
      'AJOSURES RECEIPT',
      20,
      20
    )

    doc.setFontSize(14)

    doc.text(
      `Amount: ₦${transaction.amount}`,
      20,
      50
    )

    doc.text(
      `Reference: ${transaction.reference}`,
      20,
      70
    )

    doc.text(
      `Status: ${transaction.status}`,
      20,
      90
    )

    doc.save(
      'receipt.pdf'
    )

  }