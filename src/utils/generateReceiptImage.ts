interface RegistrationData {
  division: string;
  rollNumber: string;
  name: string;
  topic: string;
  projectTopic?: string;
  isGroup?: boolean;
  member2RollNumber?: string;
  member2Name?: string;
  member2ProjectTopic?: string;
}

export function downloadReceiptImage(data: RegistrationData) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Retina 2x resolution
  const width = 1000;
  const height = data.isGroup && data.member2Name ? 1240 : 1080;
  canvas.width = width;
  canvas.height = height;

  // 1. Background Gradient (Dark Forest Theme)
  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, '#0a1210');
  bgGradient.addColorStop(0.5, '#121e1a');
  bgGradient.addColorStop(1, '#0b1411');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // Decorative Ambient Glow Orbs
  const drawGlow = (x: number, y: number, r: number, color: string) => {
    const radial = ctx.createRadialGradient(x, y, 0, x, y, r);
    radial.addColorStop(0, color);
    radial.addColorStop(1, 'transparent');
    ctx.fillStyle = radial;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };

  drawGlow(200, 150, 300, 'rgba(16, 185, 129, 0.15)'); // Emerald Glow Top Left
  drawGlow(800, 900, 350, 'rgba(5, 150, 105, 0.12)');  // Teal Glow Bottom Right

  // Helper for rounded rectangles
  const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  };

  // 2. Main Card Container (Glassmorphic Outer Card)
  const margin = 50;
  const cardX = margin;
  const cardY = margin;
  const cardW = width - margin * 2;
  const cardH = height - margin * 2;

  ctx.fillStyle = 'rgba(21, 34, 29, 0.85)';
  roundRect(cardX, cardY, cardW, cardH, 24);
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.25)';
  ctx.stroke();

  // Outer Header Badge Banner
  ctx.fillStyle = '#10B981';
  roundRect(cardX + 40, cardY + 40, 140, 28, 14);
  ctx.fill();

  ctx.font = 'bold 12px sans-serif';
  ctx.fillStyle = '#064E3B';
  ctx.textAlign = 'center';
  ctx.fillText('SYMBIOSIS SCAC', cardX + 110, cardY + 58);

  // Title: EVS REGISTRATION RECEIPT
  ctx.textAlign = 'left';
  ctx.font = 'bold 30px serif';
  ctx.fillStyle = '#F9FAFB';
  ctx.fillText('EVS Registration Receipt', cardX + 40, cardY + 110);

  ctx.font = '500 14px sans-serif';
  ctx.fillStyle = '#9CA3AF';
  ctx.fillText('Environmental Studies • Grade 12 Official Record', cardX + 40, cardY + 135);

  // Division & Format Pill Right-aligned
  const badgeText = `DIV ${data.division} • ${data.isGroup ? 'GROUP' : 'INDIVIDUAL'}`;
  ctx.font = 'bold 13px sans-serif';
  const badgeWidth = ctx.measureText(badgeText).width + 30;
  const badgeX = cardX + cardW - 40 - badgeWidth;
  
  ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
  roundRect(badgeX, cardY + 105, badgeWidth, 34, 17);
  ctx.fill();
  ctx.strokeStyle = 'rgba(52, 211, 153, 0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.fillStyle = '#34D399';
  ctx.fillText(badgeText, badgeX + 15, cardY + 127);

  // Divider Line
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.moveTo(cardX + 40, cardY + 160);
  ctx.lineTo(cardX + cardW - 40, cardY + 160);
  ctx.stroke();

  let currY = cardY + 200;

  // 3. Member 1 Section
  const drawSectionLabel = (label: string, y: number) => {
    ctx.font = 'bold 12px sans-serif';
    ctx.fillStyle = '#34D399';
    ctx.fillText(label.toUpperCase(), cardX + 40, y);
  };

  drawSectionLabel(data.isGroup ? 'Student Member 1' : 'Student Details', currY);
  currY += 28;

  ctx.font = 'bold 20px sans-serif';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(data.name, cardX + 40, currY);
  
  const nameWidth = ctx.measureText(data.name).width;
  ctx.font = '500 16px sans-serif';
  ctx.fillStyle = '#9CA3AF';
  ctx.fillText(`(Roll No. ${data.rollNumber})`, cardX + 55 + nameWidth, currY);
  currY += 26;

  if (data.projectTopic) {
    ctx.font = '14px sans-serif';
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText('Blue Book Project: ', cardX + 40, currY);
    const lblW = ctx.measureText('Blue Book Project: ').width;
    ctx.fillStyle = '#E5E7EB';
    ctx.fillText(data.projectTopic, cardX + 40 + lblW, currY);
    currY += 28;
  }

  // 4. Member 2 Section if group
  if (data.isGroup && data.member2Name) {
    currY += 15;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.beginPath();
    ctx.moveTo(cardX + 40, currY);
    ctx.lineTo(cardX + cardW - 40, currY);
    ctx.stroke();
    currY += 30;

    drawSectionLabel('Student Member 2', currY);
    currY += 28;

    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(data.member2Name, cardX + 40, currY);

    const m2NameW = ctx.measureText(data.member2Name).width;
    ctx.font = '500 16px sans-serif';
    ctx.fillStyle = '#9CA3AF';
    ctx.fillText(`(Roll No. ${data.member2RollNumber || 'N/A'})`, cardX + 55 + m2NameW, currY);
    currY += 26;

    if (data.member2ProjectTopic) {
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#9CA3AF';
      ctx.fillText('Blue Book Project: ', cardX + 40, currY);
      const lblW = ctx.measureText('Blue Book Project: ').width;
      ctx.fillStyle = '#E5E7EB';
      ctx.fillText(data.member2ProjectTopic, cardX + 40 + lblW, currY);
      currY += 28;
    }
  }

  // 5. Seminar Presentation Topic Section Box
  currY += 20;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.beginPath();
  ctx.moveTo(cardX + 40, currY);
  ctx.lineTo(cardX + cardW - 40, currY);
  ctx.stroke();
  currY += 35;

  drawSectionLabel('Registered Seminar Topic', currY);
  currY += 32;

  // Text Wrapping helper for Topic
  const maxTopicWidth = cardW - 100;
  ctx.font = 'bold 24px serif';
  ctx.fillStyle = '#6EE7B7'; // Mint Topic Color

  const words = data.topic.split(' ');
  let line = '';
  const lines: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxTopicWidth && i > 0) {
      lines.push(line);
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);

  lines.forEach(l => {
    ctx.fillText(l.trim(), cardX + 40, currY);
    currY += 34;
  });

  // 6. Verification Footer Stamp
  const footerY = cardY + cardH - 50;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.beginPath();
  ctx.moveTo(cardX + 40, footerY - 30);
  ctx.lineTo(cardX + cardW - 40, footerY - 30);
  ctx.stroke();

  const timeStr = `Registered: ${new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })} • EVS Portal Verified`;
  ctx.font = '12px monospace';
  ctx.fillStyle = '#6B7280';
  ctx.fillText(timeStr, cardX + 40, footerY);

  ctx.textAlign = 'right';
  ctx.fillText('Official Confirmation Stamp ✔', cardX + cardW - 40, footerY);

  // Trigger PNG download
  const link = document.createElement('a');
  link.download = `EVS_Registration_Div${data.division}_Roll${data.rollNumber}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
