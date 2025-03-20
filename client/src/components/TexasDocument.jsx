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
    //   console.log('Starting print process...');

      const canvas = printCanvasRef.current;
      if (!canvas) {
        console.error('Canvas ref is not initialized');
        return;
      }

      // Set canvas resolution to 300 DPI for A4 (210mm x 297mm)
      const dpi = 300;
      const widthInches = 210 / 25.4; // 210mm to inches
      const heightInches = 297 / 25.4; // 297mm to inches
      canvas.width = Math.round(widthInches * dpi); // 2480 pixels
      canvas.height = Math.round(heightInches * dpi); // 3508 pixels

      // Scale the canvas context to match the resolution
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        console.error('Failed to get canvas context');
        return;
      }
      const scale = dpi / 96; // Scale factor (300 DPI / 96 DPI)
      ctx.scale(scale, scale);

      // Load letterhead image
      console.log('Loading letterhead image...');
      const letterheadImg = new Image();
      letterheadImg.src = '/texasletterhead.jpg';
      letterheadImg.crossOrigin = 'Anonymous';
      await new Promise((resolve, reject) => {
        letterheadImg.onload = () => {
          console.log('Letterhead image loaded successfully');
          resolve();
        };
        letterheadImg.onerror = (err) => {
          console.error('Failed to load letterhead image:', err);
          reject(err);
        };
      });

      // Draw the letterhead image (scaled to fit the new resolution)
      ctx.drawImage(letterheadImg, 0, 0, 210 * (96 / 25.4), 297 * (96 / 25.4)); // Scale to 96 DPI coordinates

      // Set font and color for text
      ctx.fillStyle = '#2E1A47';
      ctx.font = 'bold 20px Cambria';
      ctx.textAlign = 'center';
      ctx.fillText('Notice of Disciplinary Action', (210 * (96 / 25.4)) / 2 + 40, 150);

      // Employee and Supervisor Info (two-column layout, shifted right)
      ctx.font = '14px Cambria';
      ctx.textAlign = 'left';
      ctx.fillText(`EMPLOYEE NAME: ${formData.employeeName || ''}`, 100, 200);
      ctx.fillText(`SUPERVISOR NAME: ${formData.supervisorName || ''}`, 100, 220);
      ctx.fillText(`DATE: ${formData.date || ''}`, 450, 200);
      ctx.fillText(`LOCATION: ${formData.location || ''}`, 450, 220);

      // Warning Types (single row with tick marks, shifted right)
      ctx.font = '14px Cambria';
      let xOffset = 100;
      const warningTypes = ['Verbal Warning', 'Written Warning', 'Final Warning', 'Suspension', 'Termination'];
      warningTypes.forEach((type) => {
        const isChecked = formData.warningType.includes(type) ? '✔' : '';
        ctx.fillText(`${isChecked} ${type}`, xOffset, 255);
        xOffset += 120;
      });

      // Company Statement and Nature of Violation (shifted right)
      ctx.font = 'bold 14px Cambria';
      ctx.fillText('COMPANY STATEMENT', 100, 285);
      ctx.fillText('Nature of Violation', 350, 285);
      ctx.font = '12px Cambria';
      wrapText(ctx, formData.companyStatement || '', 100, 305, 200, 15);
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
      let yOffset = 305;
      violations.forEach((violation) => {
        const isChecked = formData.violation.includes(violation) ? '✔' : '';
        ctx.fillText(`${isChecked} ${violation}`, 350, yOffset);
        yOffset += 20;
      });

      // Employee Statement and I DISAGREE (shifted right)
      ctx.font = 'bold 14px Cambria';
      ctx.fillText('EMPLOYEE STATEMENT', 100, yOffset + 20);
      ctx.font = '12px Cambria';
      wrapText(
        ctx,
        'I Acknowledge receipt of this disciplinary notice and understand its contents. I am aware that any further violations may result in additional disciplinary action, up to and including termination of employment.',
        100,
        yOffset + 50,
        600,
        15
      );
      yOffset += 60;
      ctx.font = '14px Cambria';
      ctx.fillText('I DISAGREE with company’s description of violation:', 100, yOffset + 30);
      wrapText(ctx, formData.disagree || '', 100, yOffset + 50, 600, 15);

      // Signatures (labels only, shifted right, with date labels below)
      yOffset += 50;
      ctx.font = 'bold 14px Cambria';
      ctx.fillText('SIGNATURE', 100, yOffset + 50);
      ctx.font = '14px Cambria';
      ctx.fillText('EMPLOYEE SIGNATURE:', 100, yOffset + 70);
      ctx.fillText('SUPERVISOR SIGNATURE:', 450, yOffset + 70);
      ctx.fillText('DATE:', 100, yOffset + 150);
      ctx.fillText('DATE:', 450, yOffset + 150);

      // Footer: 6464survy (ensure it fits on the same page)
      ctx.font = '12px Cambria';
      ctx.textAlign = 'center';

      // Open print dialog with canvas content
      console.log('Opening print window...');
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        console.error('Failed to open print window. Check if pop-ups are blocked.');
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
      alert('An error occurred while preparing the document for printing. Please check the console for details.');
    }
  };

  // Helper function to wrap text
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
      <canvas
        ref={printCanvasRef}
        style={{ display: 'none' }}
      />
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