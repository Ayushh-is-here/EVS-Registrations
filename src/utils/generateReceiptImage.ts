import { toPng } from 'html-to-image';

export interface RegistrationReceiptData {
  division: string;
  rollNumber: string | number;
  name: string;
  topic: string;
  projectTopic?: string | null;
  isGroup?: boolean;
  member2RollNumber?: string | number | null;
  member2Name?: string | null;
  member2ProjectTopic?: string | null;
  createdAt?: string | null;
  hasUploaded?: boolean;
}

export function generateReceiptSummaryText(data: RegistrationReceiptData): string {
  const isGroup = Boolean(data.isGroup || data.member2Name || data.member2RollNumber);
  const regDate = data.createdAt ? new Date(data.createdAt).toLocaleString('en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }) : new Date().toLocaleString();

  return `=== EVS TOPIC REGISTRATION RECEIPT ===
Symbiosis College of Arts and Commerce
Division: Division ${data.division}
Format: ${isGroup ? 'Group Presentation (2 Members)' : 'Individual Presentation'}

--- STUDENT DETAILS ---
Name: ${data.name}
Roll Number: ${data.rollNumber}
${data.projectTopic ? `Blue Book Project Topic: ${data.projectTopic}` : ''}

${isGroup && data.member2Name ? `--- MEMBER 2 DETAILS ---
Name: ${data.member2Name}
Roll Number: ${data.member2RollNumber || 'N/A'}
${data.member2ProjectTopic ? `Blue Book Project Topic: ${data.member2ProjectTopic}` : ''}` : ''}

--- REGISTERED SEMINAR TOPIC ---
Topic: ${data.topic}

Registered Date: ${regDate}
Status: Official EVS Portal Verified Record
=====================================`;
}

/**
 * Downloads the exact post-registration confirmation card as a high-resolution PNG image
 * matching the user interface preview card.
 */
export async function downloadReceiptImage(data: RegistrationReceiptData, existingElement?: HTMLElement | null): Promise<void> {
  const filename = `EVS_Registration_Div${data.division}_Roll${data.rollNumber}.png`;

  // If an already rendered DOM element is provided (e.g. from the modal or confirmation screen), capture it directly
  if (existingElement) {
    try {
      const dataUrl = await toPng(existingElement, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: '#f5f9f6',
      });
      const link = document.createElement('a');
      link.download = filename;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return;
    } catch (err) {
      console.warn('Failed to capture existing DOM element, falling back to offscreen renderer:', err);
    }
  }

  // Format date & time
  const isGroup = Boolean(data.isGroup || data.member2Name || data.member2RollNumber);
  const regDateObj = data.createdAt ? new Date(data.createdAt) : new Date();
  const dateFormatted = regDateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
  const timeFormatted = regDateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).toLowerCase();

  // Create an offscreen container matching the exact layout in the user's screenshot
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = '540px';
  container.style.zIndex = '-1000';
  container.style.pointerEvents = 'none';

  container.innerHTML = `
    <div style="width: 540px; background: #f5f9f6; padding: 36px 28px; border-radius: 28px; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; box-sizing: border-box; display: flex; flex-direction: column; align-items: center; border: 1px solid #d9e6dc; color: #112217;">
      
      <!-- Top Animated-style Success Badge -->
      <div style="width: 60px; height: 60px; border-radius: 9999px; background: rgba(16, 185, 129, 0.2); display: flex; align-items: center; justify-content: center; margin-bottom: 16px; position: relative;">
        <div style="position: absolute; inset: -4px; border-radius: 9999px; border: 1px solid rgba(16, 185, 129, 0.35);"></div>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      </div>

      <!-- Heading -->
      <h2 style="font-size: 26px; font-weight: 800; color: #0d1e14; margin: 0 0 4px 0; text-align: center; letter-spacing: -0.025em;">Registration Confirmed!</h2>
      
      <!-- Subtitle -->
      <p style="font-size: 13px; font-weight: 500; color: #5a7363; margin: 0 0 24px 0; text-align: center;">Symbiosis SCAC • Grade 12 EVS Official Record</p>

      <!-- Inner White Card -->
      <div style="width: 100%; background: #ffffff; border: 1px solid #e1ece4; border-radius: 20px; padding: 22px; box-sizing: border-box; box-shadow: 0 2px 10px rgba(0,0,0,0.03);">
        
        <!-- Header: "REGISTRATION DETAILS" & "Division X • Format" -->
        <div style="display: flex; align-items: center; justify-content: space-between; border-bottom: 1px solid #edf4ef; padding-bottom: 12px; margin-bottom: 14px;">
          <span style="font-size: 11px; font-weight: 800; letter-spacing: 0.05em; color: #166534; display: flex; align-items: center; gap: 6px; text-transform: uppercase;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#166534" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            REGISTRATION DETAILS
          </span>
          <span style="font-size: 11px; font-weight: 600; padding: 3px 12px; border-radius: 9999px; background: #f5f9f6; border: 1px solid #dbe7de; color: #15291c;">
            Division ${escapeHtml(data.division)} • ${isGroup ? 'Group' : 'Individual'}
          </span>
        </div>

        <!-- Student 1 Details -->
        <div style="margin-bottom: 14px;">
          <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #728c7b; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">
            ${isGroup ? 'STUDENT MEMBER 1' : 'STUDENT DETAILS'}
          </span>
          <p style="font-size: 16px; font-weight: 700; color: #0d1e14; margin: 0 0 4px 0;">
            ${escapeHtml(data.name)} <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; font-weight: 400; color: #5a7363;">(Roll No. ${escapeHtml(String(data.rollNumber))})</span>
          </p>
          ${data.projectTopic ? `
            <p style="font-size: 12.5px; color: #5a7363; margin: 0;">
              Blue Book Project: <span style="color: #0d1e14; font-weight: 600;">${escapeHtml(data.projectTopic)}</span>
            </p>
          ` : ''}
        </div>

        <!-- Student 2 Details if Group -->
        ${isGroup && data.member2Name ? `
          <div style="border-top: 1px solid #edf4ef; padding-top: 12px; margin-bottom: 14px;">
            <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #728c7b; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">
              STUDENT MEMBER 2
            </span>
            <p style="font-size: 16px; font-weight: 700; color: #0d1e14; margin: 0 0 4px 0;">
              ${escapeHtml(data.member2Name)} <span style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 12px; font-weight: 400; color: #5a7363;">(Roll No. ${escapeHtml(String(data.member2RollNumber || 'N/A'))})</span>
            </p>
            ${data.member2ProjectTopic ? `
              <p style="font-size: 12.5px; color: #5a7363; margin: 0;">
                Blue Book Project: <span style="color: #0d1e14; font-weight: 600;">${escapeHtml(data.member2ProjectTopic)}</span>
              </p>
            ` : ''}
          </div>
        ` : ''}

        <!-- Seminar Topic -->
        <div style="border-top: 1px solid #edf4ef; padding-top: 12px; margin-bottom: 14px;">
          <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #166534; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">
            REGISTERED SEMINAR TOPIC
          </span>
          <p style="font-size: 16px; font-weight: 700; color: #0d1e14; line-height: 1.35; margin: 0;">
            ${escapeHtml(data.topic)}
          </p>
        </div>

        <!-- Footer Row -->
        <div style="border-top: 1px solid #edf4ef; padding-top: 12px; display: flex; align-items: center; justify-content: space-between; font-size: 11.5px; color: #5a7363;">
          <span>Submitted: ${dateFormatted}, ${timeFormatted}</span>
          ${data.hasUploaded ? `
            <span style="color: #059669; font-weight: 600; background: #ecfdf5; padding: 2px 8px; border-radius: 6px; border: 1px solid #a7f3d0;">
              Presentation File: Uploaded
            </span>
          ` : `
            <span style="color: #d97706; font-weight: 600;">
              Presentation File: Pending
            </span>
          `}
        </div>

      </div>
    </div>
  `;

  document.body.appendChild(container);

  try {
    const dataUrl = await toPng(container.firstElementChild as HTMLElement, {
      cacheBust: true,
      pixelRatio: 3,
      backgroundColor: '#f5f9f6',
    });

    const link = document.createElement('a');
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (err) {
    console.error('Failed to generate receipt image:', err);
  } finally {
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
  }
}

function escapeHtml(text: string): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
