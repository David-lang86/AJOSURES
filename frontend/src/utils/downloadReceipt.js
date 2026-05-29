import jsPDF from 'jspdf'

export const downloadReceipt =
  ({
    title,
    amount,
    reference,
  }) => {

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
      `Title: ${title}`,
      20,
      50
    )

    doc.text(
      `Amount: ₦${amount}`,
      20,
      70
    )

    doc.text(
      `Reference: ${reference}`,
      20,
      90
    )

    doc.save('receipt.pdf')

  }