// DisciplinaryForm.js
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Form } from 'react-bootstrap';
import './Styles/DisciplinaryForm.css'; // Renamed CSS file for consistency

// Centralized constants
const WARNING_TYPES = [
  'Verbal Warning',
  'Written Warning',
  'Final Warning',
  'Suspension',
  'Termination',
];

const VIOLATIONS = [
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

const FORM_STYLES = {
  container: { minHeight: '100vh', width: '210mm', margin: '0 auto', padding: '10mm', boxSizing: 'border-box' },
  input: { borderColor: '#E10174', fontSize: '0.9rem' },
  textarea: { borderColor: '#E10174', fontSize: '0.9rem', height: '40mm' },
  button: { backgroundColor: '#E10174', borderColor: '#E10174', color: 'white', fontSize: '0.9rem' },
};

const DisciplinaryForm = ({ letterheadImgSrc, companyName }) => {
  const [formData, setFormData] = useState({
    employeeName: '',
    date: '',
    supervisorName: '',
    location: '',
    company: companyName || 'Default Company',
    warningType: [],
    violation: [],
    companyStatement: '',
    disagree: '',
    otherViolationText: '', // Added for "Others (If Any):" input
  });

  const printCanvasRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      const key = name === 'warningType' ? 'warningType' : 'violation';
      setFormData((prev) => ({
        ...prev,
        [key]: checked
          ? [...prev[key], value]
          : prev[key].filter((item) => item !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePrint = async () => {
    try {
      const canvas = printCanvasRef.current;
      if (!canvas) throw new Error('Canvas ref is not initialized');

      const dpi = 300;
      const widthInches = 210 / 25.4;
      const heightInches = 297 / 25.4;
      canvas.width = Math.round(widthInches * dpi);
      canvas.height = Math.round(heightInches * dpi);

      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');
      const scale = dpi / 96;
      ctx.scale(scale, scale);

      const letterheadImg = new Image();
      letterheadImg.src = letterheadImgSrc;
      letterheadImg.crossOrigin = 'Anonymous';
      await new Promise((resolve, reject) => {
        letterheadImg.onload = resolve;
        letterheadImg.onerror = reject;
      });

      ctx.drawImage(letterheadImg, 0, 0, 210 * (96 / 25.4), 297 * (96 / 25.4));

      const tableX = 100;
      const tableWidth = 650;
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 1.2;
      const outerTableY = 180;

      const rowHeights = {
        heading: 30,
        header: 25,
        warning: 25,
        violation: 20,
        employee: [25, 50, 50],
        signature: [25, 50, 50],
      };

      const outerTableHeight =
        rowHeights.heading +
        2 * rowHeights.header +
        rowHeights.warning +
        (VIOLATIONS.length + 1) * rowHeights.violation +
        rowHeights.employee.reduce((a, b) => a + b, 0) +
        rowHeights.signature.reduce((a, b) => a + b, 0);

      ctx.strokeRect(tableX, outerTableY, tableWidth, outerTableHeight);

      let currentY = outerTableY;
      const rowYPositions = [];

      const drawRowLine = (y, startX = tableX, endX = tableX + tableWidth) => {
        ctx.beginPath();
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
        ctx.stroke();
        rowYPositions.push(y);
      };

      currentY += rowHeights.heading;
      drawRowLine(currentY);
      for (let i = 0; i < 2; i++) {
        currentY += rowHeights.header;
        drawRowLine(currentY);
      }
      currentY += rowHeights.warning;
      drawRowLine(currentY);

      const companySectionStartY = currentY;
      currentY += rowHeights.violation;
      drawRowLine(currentY);

      ctx.font = '14px Cambria';
      const maxViolationWidth = Math.max(...VIOLATIONS.map((v) => ctx.measureText(v).width)) - 22;
      const companyStatementWidth = tableWidth - maxViolationWidth;

      for (let i = 0; i < VIOLATIONS.length; i++) {
        currentY += rowHeights.violation;
        drawRowLine(currentY, i === VIOLATIONS.length - 1 ? tableX : tableX + companyStatementWidth);
      }

      rowHeights.employee.forEach((height) => {
        currentY += height;
        drawRowLine(currentY);
      });
      rowHeights.signature.slice(0, -1).forEach((height) => {
        currentY += height;
        drawRowLine(currentY);
      });

      const headerColWidth = tableWidth / 2;
      const warningWidths = WARNING_TYPES.map((type) => ctx.measureText(type).width + 30);
      const totalWarningWidth = warningWidths.reduce((a, b) => a + b, 0);
      const warningScaleFactor = tableWidth / totalWarningWidth;
      const warningColWidths = warningWidths.map((w) => w * warningScaleFactor);
      const signatureColWidth = tableWidth / 2;

      ctx.beginPath();
      ctx.moveTo(tableX + headerColWidth, outerTableY + rowHeights.heading);
      ctx.lineTo(tableX + headerColWidth, outerTableY + rowHeights.heading + 2 * rowHeights.header);
      ctx.stroke();

      let warningX = tableX;
      for (let i = 0; i < warningColWidths.length - 1; i++) {
        warningX += warningColWidths[i];
        ctx.beginPath();
        ctx.moveTo(warningX, outerTableY + rowHeights.heading + 2 * rowHeights.header);
        ctx.lineTo(warningX, outerTableY + rowHeights.heading + 2 * rowHeights.header + rowHeights.warning);
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.moveTo(tableX + companyStatementWidth, companySectionStartY);
      ctx.lineTo(tableX + companyStatementWidth, companySectionStartY + (VIOLATIONS.length + 1) * rowHeights.violation);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(tableX + signatureColWidth, outerTableY + outerTableHeight - 2 * rowHeights.signature[1]);
      ctx.lineTo(tableX + signatureColWidth, outerTableY + outerTableHeight);
      ctx.stroke();

      let contentY = outerTableY;
      ctx.fillStyle = '#2E1A47';
      ctx.font = 'bold 20px Cambria';
      ctx.textAlign = 'center';
      ctx.fillText('Notice of Disciplinary Action', tableX + tableWidth / 2, contentY + 20);
      contentY += rowHeights.heading;

      ctx.font = '14px Cambria';
      ctx.textAlign = 'left';
      const headerPadding = 10;
      const wrapText = (text, x, y, maxWidth, lineHeight) => {
        const words = text.split(' ');
        let line = '';
        let yPos = y;
        for (let i = 0; i < words.length; i++) {
          const testLine = line + words[i] + ' ';
          const testWidth = ctx.measureText(testLine).width;
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

      wrapText(`EMPLOYEE NAME: ${formData.employeeName || ''}`, tableX + headerPadding, contentY + 15, headerColWidth - 2 * headerPadding, 15);
      wrapText(`SUPERVISOR NAME: ${formData.supervisorName || ''}`, tableX + headerPadding, contentY + 40, headerColWidth - 2 * headerPadding, 15);
      wrapText(`DATE: ${formData.date || ''}`, tableX + headerColWidth + headerPadding, contentY + 15, headerColWidth - 2 * headerPadding, 15);
      wrapText(`LOCATION: ${formData.location || ''}`, tableX + headerColWidth + headerPadding, contentY + 40, headerColWidth - 2 * headerPadding, 15);
      contentY += 2 * rowHeights.header;

      ctx.font = '14px Cambria';
      let warningXOffset = tableX + 25;
      WARNING_TYPES.forEach((type, index) => {
        const isChecked = formData.warningType.includes(type) ? '✔' : '';
        wrapText(`${isChecked} ${type}`, warningXOffset, contentY + 20, warningColWidths[index] - 10, 15);
        warningXOffset += warningColWidths[index];
      });
      contentY += rowHeights.warning;

      ctx.font = 'bold 14px Cambria';
      ctx.textAlign = 'center';
      ctx.fillText('COMPANY STATEMENT', tableX + companyStatementWidth / 2, contentY + 15);
      ctx.fillText('Nature of Violation', tableX + companyStatementWidth + maxViolationWidth / 2, contentY + 15);
      contentY += rowHeights.violation;

      ctx.font = '12px Cambria';
      ctx.textAlign = 'left';
      wrapText(formData.companyStatement || '', tableX + 10, contentY + 15, companyStatementWidth - 20, 15);
      VIOLATIONS.forEach((violation) => {
        const isChecked = formData.violation.includes(violation) ? '✔' : '';
        let displayText = `${isChecked} ${violation}`;
        if (violation === 'Others (If Any):' && formData.violation.includes(violation) && formData.otherViolationText) {
          displayText += ` ${formData.otherViolationText}`;
        }
        wrapText(displayText, tableX + companyStatementWidth + 10, contentY + 15, maxViolationWidth - 20, 15);
        contentY += rowHeights.violation;
      });

      ctx.font = 'bold 14px Cambria';
      ctx.textAlign = 'center';
      ctx.fillText('EMPLOYEE STATEMENT', tableX + tableWidth / 2, contentY + 18);
      contentY += rowHeights.employee[0];

      ctx.font = '12px Cambria';
      ctx.textAlign = 'left';
      const employeeStatementMargin = 10;
      const employeeStatementText =
        'I Acknowledge receipt of this disciplinary notice and understand its contents. I am aware that any further violations may result in additional disciplinary action, up to and including termination of employment.';
      wrapText(employeeStatementText, tableX + employeeStatementMargin, contentY + 15, tableWidth - 2 * employeeStatementMargin, 15);
      contentY += rowHeights.employee[1];

      wrapText(`I DISAGREE with company’s description of violation: ${formData.disagree || ''}`, tableX + employeeStatementMargin, contentY + 15, tableWidth - 2 * employeeStatementMargin, 15);
      contentY += rowHeights.employee[2];

      ctx.font = 'bold 14px Cambria';
      ctx.textAlign = 'center';
      ctx.fillText('SIGNATURE', tableX + tableWidth / 2, contentY + 17);
      contentY += rowHeights.signature[0];

      ctx.font = '14px Cambria';
      ctx.fillText('EMPLOYEE SIGNATURE:', tableX + signatureColWidth / 4, contentY + 20);
      ctx.fillText('SUPERVISOR SIGNATURE:', tableX + signatureColWidth + signatureColWidth / 4+10, contentY + 20);
      contentY += rowHeights.signature[1];

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } },
  };

  const isOtherViolationSelected = formData.violation.includes('Others (If Any):');

  return (
    <motion.div
      className="print-container card mt-4"
      style={FORM_STYLES.container}
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
              style={FORM_STYLES.input}
            />
          </Form.Group>
          <Form.Group className="col-md-6">
            <Form.Label>DATE:</Form.Label>
            <Form.Control type="date" name="date" value={formData.date} onChange={handleChange} style={FORM_STYLES.input} />
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
              style={FORM_STYLES.input}
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
              style={FORM_STYLES.input}
            />
          </Form.Group>
        </div>

        <Form.Group className="mb-2">
          <div className="row">
            {WARNING_TYPES.map((type) => (
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
            {VIOLATIONS.map((violation) => (
              <div key={violation} className="col-md-6 mb-1">
                <Form.Check
                  type="checkbox"
                  label={violation}
                  name="violation"
                  value={violation}
                  checked={formData.violation.includes(violation)}
                  onChange={handleChange}
                  style={{ fontSize: '0.8rem' }}
                />
                {violation === 'Others (If Any):' && isOtherViolationSelected && (
                  <Form.Control
                    type="text"
                    name="otherViolationText"
                    value={formData.otherViolationText}
                    onChange={handleChange}
                    placeholder="Specify other violation"
                    style={{ ...FORM_STYLES.input, marginTop: '5px' }}
                  />
                )}
              </div>
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
            style={FORM_STYLES.textarea}
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
            style={FORM_STYLES.input}
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
            style={FORM_STYLES.button}
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
};

export default DisciplinaryForm;