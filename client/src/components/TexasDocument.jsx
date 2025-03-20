import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Form } from 'react-bootstrap';
import './Styles/TexasDocument.css';

function TexasDocument() {
  const [formData, setFormData] = useState({
    employeeName: '',
    date: '',
    supervisorName: '',
    location: '',
    company: 'Texas Mobile PCS',
    warningType: [],
    violation: [],
    companyStatement: '',
    disagree: '',
  });

  const printCanvasRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (name === 'warningType') {
        setFormData((prev) => ({
          ...prev,
          warningType: checked
            ? [...prev.warningType, value]
            : prev.warningType.filter((item) => item !== value),
        }));
      } else if (name === 'violation') {
        setFormData((prev) => ({
          ...prev,
          violation: checked
            ? [...prev.violation, value]
            : prev.violation.filter((item) => item !== value),
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handlePrint = async () => {
    try {
      const canvas = printCanvasRef.current;
      if (!canvas) {
        console.error('Canvas ref is not initialized');
        return;
      }

      const dpi = 300;
      const widthInches = 210 / 25.4;
      const heightInches = 297 / 25.4;
      canvas.width = Math.round(widthInches * dpi);
      canvas.height = Math.round(heightInches * dpi);

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get canvas context');
        return;
      }
      const scale = dpi / 96;
      ctx.scale(scale, scale);

      const letterheadImg = new Image();
      letterheadImg.src = '/texasletterhead.jpg';
      letterheadImg.crossOrigin = 'Anonymous';
      await new Promise((resolve, reject) => {
        letterheadImg.onload = resolve;
        letterheadImg.onerror = reject;
      });

      ctx.drawImage(letterheadImg, 0, 0, 210 * (96 / 25.4), 297 * (96 / 25.4));

      // Define common table properties
      const tableX = 100;
      const tableWidth = 650;
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1.2;

      // Move the entire table down to avoid the logo
      const outerTableY = 180;

      // Define row heights
      const headingRowHeight = 30;
      const headerRowHeight = 25;
      const warningRowHeight = 25;
      const violationRowHeight = 20;
      const employeeRowHeights = [25, 50, 50]; // Header, acknowledgment, I DISAGREE
      const signatureRowHeights = [25, 50, 50]; // SIGNATURE header, EMPLOYEE/SUPERVISOR SIGNATURE, DATE

      const violations = [
        'Violation of work policy and Procedures',
        'Insubordination',
        'Under the influence of and/or possession of drugs or alcohol',
        'Clocking out early/Clock in Late',
        'Disobedience and Dishonesty',
        'Failure to follow Instruction',
        'Failure to observe proper safety procedures',
        'Rudeness to Customers',
        'Failure to complete work assignment',
        'Discourtesy or verbal abuse of guest or other employee',
        'Tardiness, absenteeism, failure to report for work',
        'Damage or misuse of company property',
        'Unauthorized removal of company property (cell phones) or etc.',
        'Physical or verbal assault and/or fighting',
        'Others (If Any):',
      ];

      // Calculate total height of the outer table
      const outerTableHeight =
        headingRowHeight +
        (2 * headerRowHeight) +
        warningRowHeight +
        ((violations.length + 1) * violationRowHeight) +
        employeeRowHeights.reduce((a, b) => a + b, 0) +
        signatureRowHeights.reduce((a, b) => a + b, 0);

      // Draw the outer border
      ctx.strokeRect(tableX, outerTableY, tableWidth, outerTableHeight);

      // Draw horizontal lines for each row
      let currentY = outerTableY;
      const rowYPositions = [];

      // Heading row
      currentY += headingRowHeight;
      rowYPositions.push(currentY);
      ctx.beginPath();
      ctx.moveTo(tableX, currentY);
      ctx.lineTo(tableX + tableWidth, currentY);
      ctx.stroke();

      // Header section (2 rows)
      for (let i = 0; i < 2; i++) {
        currentY += headerRowHeight;
        rowYPositions.push(currentY);
        ctx.beginPath();
        ctx.moveTo(tableX, currentY);
        ctx.lineTo(tableX + tableWidth, currentY);
        ctx.stroke();
      }

      // Warning Types (1 row)
      currentY += warningRowHeight;
      rowYPositions.push(currentY);
      ctx.beginPath();
      ctx.moveTo(tableX, currentY);
      ctx.lineTo(tableX + tableWidth, currentY);
      ctx.stroke();

      // Company Statement and Nature of Violation (1 header + 15 violations)
      const companySectionStartY = currentY;
      currentY += violationRowHeight; // Header row
      rowYPositions.push(currentY);
      ctx.beginPath();
      ctx.moveTo(tableX, currentY);
      ctx.lineTo(tableX + tableWidth, currentY);
      ctx.stroke();

      // Calculate column widths for Company Statement and Nature of Violation based on text length
      ctx.font = '14px Cambria';
      const maxViolationWidth = Math.max(...violations.map(v => ctx.measureText(v).width)) + 30; // +30 for padding and checkbox
      const companyStatementWidth = tableWidth - maxViolationWidth;

      // Draw row lines only in the "Nature of Violation" column, except for the last one
      for (let i = 0; i < violations.length; i++) {
        currentY += violationRowHeight;
        rowYPositions.push(currentY);
        ctx.beginPath();
        if (i === violations.length - 1) {
          // Last row line should span the full width to act as the bottom border for "COMPANY STATEMENT"
          ctx.moveTo(tableX, currentY);
          ctx.lineTo(tableX + tableWidth, currentY);
        } else {
          // Internal row lines only in "Nature of Violation" column
          ctx.moveTo(tableX + companyStatementWidth, currentY);
          ctx.lineTo(tableX + tableWidth, currentY);
        }
        ctx.stroke();
      }

      // Employee Statement (3 rows)
      for (let i = 0; i < employeeRowHeights.length; i++) {
        currentY += employeeRowHeights[i];
        rowYPositions.push(currentY);
        ctx.beginPath();
        ctx.moveTo(tableX, currentY);
        ctx.lineTo(tableX + tableWidth, currentY);
        ctx.stroke();
      }

      // Signature (3 rows)
      for (let i = 0; i < signatureRowHeights.length; i++) {
        currentY += signatureRowHeights[i];
        rowYPositions.push(currentY);
        if (i < signatureRowHeights.length - 1) { // Don't draw the last line (it's the outer border)
          ctx.beginPath();
          ctx.moveTo(tableX, currentY);
          ctx.lineTo(tableX + tableWidth, currentY);
          ctx.stroke();
        }
      }

      // Draw vertical lines for columns
      const headerColWidth = tableWidth / 2;

      // Calculate column widths for Warning Types based on text length
      const warningTypes = ['Verbal Warning', 'Written Warning', 'Final Warning', 'Suspension', 'Termination'];
      ctx.font = '14px Cambria';
      const warningWidths = warningTypes.map(type => ctx.measureText(type).width + 30); // +30 for padding and checkbox
      const totalWarningWidth = warningWidths.reduce((a, b) => a + b, 0);
      const warningScaleFactor = tableWidth / totalWarningWidth;
      const warningColWidths = warningWidths.map(width => width * warningScaleFactor);

      const signatureColWidth = tableWidth / 2;

      // Header section columns (2 columns)
      ctx.beginPath();
      ctx.moveTo(tableX + headerColWidth, outerTableY + headingRowHeight);
      ctx.lineTo(tableX + headerColWidth, outerTableY + headingRowHeight + (2 * headerRowHeight));
      ctx.stroke();

      // Warning Types columns (5 columns, proportional)
      let warningX = tableX;
      for (let i = 0; i < warningColWidths.length - 1; i++) {
        warningX += warningColWidths[i];
        ctx.beginPath();
        ctx.moveTo(warningX, outerTableY + headingRowHeight + (2 * headerRowHeight));
        ctx.lineTo(warningX, outerTableY + headingRowHeight + (2 * headerRowHeight) + warningRowHeight);
        ctx.stroke();
      }

      // Company Statement and Nature of Violation columns (2 columns, proportional)
      ctx.beginPath();
      ctx.moveTo(tableX + companyStatementWidth, companySectionStartY);
      ctx.lineTo(tableX + companyStatementWidth, companySectionStartY + ((violations.length + 1) * violationRowHeight));
      ctx.stroke();

      // Signature columns (2 columns)
      ctx.beginPath();
      ctx.moveTo(tableX + signatureColWidth, outerTableY + outerTableHeight - (2 * signatureRowHeights[1]));
      ctx.lineTo(tableX + signatureColWidth, outerTableY + outerTableHeight);
      ctx.stroke();

      // Fill in the content
      let contentY = outerTableY;

      // Heading
      ctx.fillStyle = '#2E1A47';
      ctx.font = 'bold 20px Cambria';
      ctx.textAlign = 'center';
      ctx.fillText('Notice of Disciplinary Action', tableX + tableWidth / 2, contentY + 20);
      contentY += headingRowHeight;

      // Header Section (EMPLOYEE NAME, SUPERVISOR NAME, DATE, LOCATION)
      ctx.font = '14px Cambria';
      ctx.textAlign = 'left';
      const headerPadding = 10;
      wrapText(ctx, `EMPLOYEE NAME: ${formData.employeeName || ''}`, tableX + headerPadding, contentY + 15, headerColWidth - (2 * headerPadding), 15);
      wrapText(ctx, `SUPERVISOR NAME: ${formData.supervisorName || ''}`, tableX + headerPadding, contentY + 40, headerColWidth - (2 * headerPadding), 15);
      wrapText(ctx, `DATE: ${formData.date || ''}`, tableX + headerColWidth + headerPadding, contentY + 15, headerColWidth - (2 * headerPadding), 15);
      wrapText(ctx, `LOCATION: ${formData.location || ''}`, tableX + headerColWidth + headerPadding, contentY + 40, headerColWidth - (2 * headerPadding), 15);
      contentY += 2 * headerRowHeight;

      // Warning Types
      ctx.font = '14px Cambria';
      let warningXOffset = tableX + 25; // Increase from 15 to 25 for more left padding
      warningTypes.forEach((type, index) => {
        const isChecked = formData.warningType.includes(type) ? '✔' : '';
        wrapText(ctx, `${isChecked} ${type}`, warningXOffset, contentY + 20, warningColWidths[index] - 10, 15); // Adjust Y offset and width
        warningXOffset += warningColWidths[index];
      });
      contentY += warningRowHeight;

      // Company Statement and Nature of Violation
      ctx.font = 'bold 14px Cambria';
      ctx.textAlign = 'center';
      ctx.fillText('COMPANY STATEMENT', tableX + companyStatementWidth / 2, contentY + 15);
      ctx.fillText('Nature of Violation', tableX + companyStatementWidth + maxViolationWidth / 2, contentY + 15);
      contentY += violationRowHeight;

      ctx.font = '12px Cambria';
      ctx.textAlign = 'left';
      wrapText(ctx, formData.companyStatement || '', tableX + 10, contentY + 15, companyStatementWidth - 20, 15);

      violations.forEach((violation) => {
        const isChecked = formData.violation.includes(violation) ? '✔' : '';
        wrapText(ctx, `${isChecked} ${violation}`, tableX + companyStatementWidth + 10, contentY + 15, maxViolationWidth - 20, 15);
        contentY += violationRowHeight;
      });

      // Employee Statement
      ctx.font = 'bold 14px Cambria';
      ctx.textAlign = 'center';
      ctx.fillText('EMPLOYEE STATEMENT', tableX + tableWidth / 2, contentY + 15);
      contentY += employeeRowHeights[0];

      ctx.font = '12px Cambria';
      ctx.textAlign = 'left'; // Ensure text aligns to the left
      const employeeStatementMargin = 10; // Reduced margin to start closer to the left border
      const employeeStatementText =
        'I Acknowledge receipt of this disciplinary notice and understand its contents. I am aware that any further violations may result in additional disciplinary action, up to and including termination of employment.';
      wrapText(ctx, employeeStatementText, tableX + employeeStatementMargin, contentY + 15, tableWidth - (2 * employeeStatementMargin), 15);
      contentY += employeeRowHeights[1];

      const disagreeText = 'I DISAGREE with company’s description of violation: ' + (formData.disagree || '');
      wrapText(ctx, disagreeText, tableX + employeeStatementMargin, contentY + 15, tableWidth - (2 * employeeStatementMargin), 15);
      contentY += employeeRowHeights[2];

      // Signature
      ctx.font = 'bold 14px Cambria';
      ctx.textAlign = 'center';
      ctx.fillText('SIGNATURE', tableX + tableWidth / 2, contentY + 15);
      contentY += signatureRowHeights[0];

      ctx.font = '14px Cambria';
      ctx.textAlign = 'center';
      ctx.fillText('EMPLOYEE SIGNATURE:', tableX + signatureColWidth / 4, contentY + 20);
      ctx.fillText('SUPERVISOR SIGNATURE:', tableX + signatureColWidth + signatureColWidth / 4, contentY + 20);
      contentY += signatureRowHeights[1];

      ctx.fillText('DATE:', tableX + signatureColWidth / 10, contentY + 15);
      ctx.fillText('DATE:', tableX + signatureColWidth + signatureColWidth / 10, contentY + 15);

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow pop-ups for this site to enable printing.');
        return;
      }

      const imgData = canvas.toDataURL('image/png');
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Document</title>
            <style>
              body { margin: 0; }
              img { width: 210mm; height: 297mm; }
            </style>
          </head>
          <body>
            <img src="${imgData}" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    } catch (error) {
      console.error('Error during print process:', error);
      alert('An error occurred while preparing the document for printing.');
    }
  };

  const wrapText = (ctx, text, x, y, maxWidth, lineHeight) => {
    const words = text.split(' ');
    let line = '';
    let yPos = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = ctx.measureText(testLine);
      const testWidth = metrics.width;
      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, yPos);
        line = words[i] + ' ';
        yPos += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, yPos);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      className="print-container card mt-4"
      style={{
        minHeight: '100vh',
        width: '210mm',
        margin: '0 auto',
        padding: '10mm',
        boxSizing: 'border-box',
      }}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <canvas ref={printCanvasRef} style={{ display: 'none' }} />
      <h2 className="text-center fw-bold mb-4" style={{ color: '#E10174' }}>
        Notice of Disciplinary Action
      </h2>
      <Form>
        <div className="row mb-2">
          <Form.Group className="col-md-6">
            <Form.Label>EMPLOYEE NAME:</Form.Label>
            <Form.Control
              type="text"
              name="employeeName"
              value={formData.employeeName}
              onChange={handleChange}
              placeholder="Enter employee name"
              style={{ borderColor: '#E10174', fontSize: '0.9rem' }}
            />
          </Form.Group>
          <Form.Group className="col-md-6">
            <Form.Label>DATE:</Form.Label>
            <Form.Control
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={{ borderColor: '#E10174', fontSize: '0.9rem' }}
            />
          </Form.Group>
        </div>

        <div className="row mb-2">
          <Form.Group className="col-md-6">
            <Form.Label>SUPERVISOR NAME:</Form.Label>
            <Form.Control
              type="text"
              name="supervisorName"
              value={formData.supervisorName}
              onChange={handleChange}
              placeholder="Enter supervisor name"
              style={{ borderColor: '#E10174', fontSize: '0.9rem' }}
            />
          </Form.Group>
          <Form.Group className="col-md-6">
            <Form.Label>LOCATION:</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter location"
              style={{ borderColor: '#E10174', fontSize: '0.9rem' }}
            />
          </Form.Group>
        </div>

        <Form.Group className="mb-2">
          <div className="row">
            {['Verbal Warning', 'Written Warning', 'Final Warning', 'Suspension', 'Termination'].map((type) => (
              <Form.Check
                key={type}
                className="col-md-4"
                type="checkbox"
                label={type}
                name="warningType"
                value={type}
                checked={formData.warningType.includes(type)}
                onChange={handleChange}
                style={{ fontSize: '0.85rem' }}
              />
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>COMPANY STATEMENT</Form.Label>
          <h5 style={{ fontSize: '1rem' }}>Nature of Violation</h5>
          <div className="row" style={{ maxHeight: '60mm', overflowY: 'auto' }}>
            {[
              'Violation of work policy and Procedures',
              'Insubordination',
              'Under the influence of and/or possession of drugs or alcohol',
              'Clocking out early/Clock in Late',
              'Disobedience and Dishonesty',
              'Failure to follow Instruction',
              'Failure to observe proper safety procedures',
              'Rudeness to Customers',
              'Failure to complete work assignment',
              'Discourtesy or verbal abuse of guest or other employee',
              'Tardiness, absenteeism, failure to report for work',
              'Damage or misuse of company property',
              'Unauthorized removal of company property (cell phones) or etc.',
              'Physical or verbal assault and/or fighting',
              'Others (If Any):',
            ].map((violation) => (
              <Form.Check
                key={violation}
                className="col-md-6 mb-1"
                type="checkbox"
                label={violation}
                name="violation"
                value={violation}
                checked={formData.violation.includes(violation)}
                onChange={handleChange}
                style={{ fontSize: '0.8rem' }}
              />
            ))}
          </div>
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>COMPANY STATEMENT</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="companyStatement"
            value={formData.companyStatement}
            onChange={handleChange}
            placeholder="Enter company statement here"
            style={{ borderColor: '#E10174', fontSize: '0.9rem', height: '40mm' }}
          />
        </Form.Group>

        <Form.Group className="mb-2">
          <Form.Label>I DISAGREE with company’s description of violation:</Form.Label>
          <Form.Control
            type="text"
            name="disagree"
            value={formData.disagree}
            onChange={handleChange}
            placeholder="Enter your disagreement (if any)"
            style={{ borderColor: '#E10174', fontSize: '0.9rem' }}
          />
        </Form.Group>

        <h5 className="mb-2" style={{ fontSize: '1rem' }}>SIGNATURE</h5>
        <div className="row mb-2">
          <Form.Group className="col-md-6">
            <Form.Label style={{ fontSize: '0.9rem' }}>EMPLOYEE SIGNATURE:</Form.Label>
          </Form.Group>
          <Form.Group className="col-md-6">
            <Form.Label style={{ fontSize: '0.9rem' }}>SUPERVISOR SIGNATURE:</Form.Label>
          </Form.Group>
        </div>

        <div className="text-center">
          <motion.button
            type="button"
            className="btn rounded-pill px-4 py-2"
            style={{ backgroundColor: '#E10174', borderColor: '#E10174', color: 'white', fontSize: '0.9rem' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePrint}
          >
            Print Document
          </motion.button>
        </div>
      </Form>
    </motion.div>
  );
}

export default TexasDocument;