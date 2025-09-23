import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";
import { getUserById } from "@/app/actions/getUserById";
import { getAppointmentsByUser } from "@/app/actions/getAppointmentsByUser";
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;

    // Fetch user data (doctor or patient)
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch appointments
    const appointments = await getAppointmentsByUser(userId);

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      channel: "chrome-beta",
    });

    const page = await browser.newPage();

    // Generate HTML content for PDF based on user type
    const htmlContent =
      user.userType === "doctor"
        ? generateDoctorProfileHTML(user, appointments)
        : generatePatientProfileHTML(user, appointments);

    // Set content and generate PDF
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "20mm",
        right: "20mm",
        bottom: "20mm",
        left: "20mm",
      },
    });

    await browser.close();

    // Return PDF as response
    console.log(user, user.address);
    const userTitle =
      user.userType === "doctor" ? `doctor-${user?.id}` : `patient-${user?.id}`;
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${userTitle}-profile.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

function generateDoctorProfileHTML(doctor: any, appointments: any[]): string {
  const formatDate = (dateString: string) => {
    return dateString
      ? new Date(dateString).toLocaleDateString()
      : "Not provided";
  };

  const formatDateTime = (dateString: string) => {
    return dateString ? new Date(dateString).toLocaleString() : "Not provided";
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Doctor Profile - Dr. ${doctor.name}</title>
      <style>
        ${getCommonStyles()}
        .header {
          background: linear-gradient(135deg, #2563eb, #1d4ed8);
          color: white;
        }
        .info-item {
          border-left: 4px solid #2563eb;
        }
        .appointment-item {
          border-left: 4px solid #059669;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Dr. ${doctor.name}</h1>
        <p>Doctor Professional Profile</p>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="section">
        <h2>Professional Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <strong>Doctor ID</strong>
            <span>${doctor.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div class="info-item">
            <strong>Email</strong>
            <span>${doctor.email || "Not provided"}</span>
          </div>
          <div class="info-item">
            <strong>Phone</strong>
            <span>${doctor.phone || "Not provided"}</span>
          </div>
          <div class="info-item">
            <strong>Specialty</strong>
            <span>${doctor.specialty || "Not specified"}</span>
          </div>
          <div class="info-item">
            <strong>Experience</strong>
            <span>${doctor.experience || "Not specified"}</span>
          </div>
          <div class="info-item">
            <strong>Rating</strong>
            <span>${doctor.rating ? `${doctor.rating}/5` : "Not rated"}</span>
          </div>
          <div class="info-item full-width">
            <strong>Location</strong>
            <span>${doctor.location || "Not provided"}</span>
          </div>
          <div class="info-item full-width">
            <strong>Address</strong>
            <span>${doctor.address || "Not provided"}</span>
          </div>
        </div>
      </div>

      ${generateAccountSection(doctor)}
      ${generateAppointmentSection(appointments, "doctor")}
      ${generateStatisticsSection(appointments)}

      <div class="footer">
        <p>This document was generated automatically from the medical management system.</p>
        <p>For questions or updates, please contact the medical administration office.</p>
      </div>
    </body>
    </html>
  `;
}

function generatePatientProfileHTML(patient: any, appointments: any[]): string {
  const formatDate = (dateString: string) => {
    return dateString
      ? new Date(dateString).toLocaleDateString()
      : "Not provided";
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Patient Profile - ${patient.name}</title>
      <style>
        ${getCommonStyles()}
        .header {
          background: linear-gradient(135deg, #dc2626, #b91c1c);
          color: white;
        }
        .info-item {
          border-left: 4px solid #dc2626;
        }
        .appointment-item {
          border-left: 4px solid #2563eb;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${patient.name}</h1>
        <p>Patient Medical Profile</p>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="section">
        <h2>Personal Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <strong>Patient ID</strong>
            <span>${patient.id.slice(0, 8).toUpperCase()}</span>
          </div>
          <div class="info-item">
            <strong>Email</strong>
            <span>${patient.email || "Not provided"}</span>
          </div>
          <div class="info-item">
            <strong>Phone</strong>
            <span>${patient.phone || "Not provided"}</span>
          </div>
          <div class="info-item">
            <strong>Medical Record Number</strong>
            <span>${patient.medical_record_number || "Not assigned"}</span>
          </div>
          <div class="info-item">
            <strong>Date of Birth</strong>
            <span>${
              patient.date_of_birth
                ? formatDate(patient.date_of_birth)
                : "Not provided"
            }</span>
          </div>
          <div class="info-item">
            <strong>Gender</strong>
            <span style="text-transform: capitalize">${
              patient.gender || "Not specified"
            }</span>
          </div>
          <div class="info-item full-width">
            <strong>Address</strong>
            <span>${patient.address || "Not provided"}</span>
          </div>
          <div class="info-item full-width">
            <strong>Emergency Contact</strong>
            <span>${patient.emergency_contact || "Not provided"}</span>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>Medical Information</h2>
        <div class="info-grid">
          <div class="info-item">
            <strong>Insurance Provider</strong>
            <span>${patient.insurance_provider || "Not provided"}</span>
          </div>
          <div class="info-item">
            <strong>Insurance Number</strong>
            <span>${patient.insurance_number || "Not provided"}</span>
          </div>
          <div class="info-item full-width">
            <strong>Medical History</strong>
            <span>${
              patient.medical_history || "No medical history recorded"
            }</span>
          </div>
          <div class="info-item full-width">
            <strong>Allergies</strong>
            <span>${patient.allergies || "No known allergies"}</span>
          </div>
          <div class="info-item full-width">
            <strong>Current Medications</strong>
            <span>${
              patient.current_medications || "No current medications"
            }</span>
          </div>
        </div>
      </div>

      ${generateAccountSection(patient)}
      ${generateAppointmentSection(appointments, "patient")}
      ${generateStatisticsSection(appointments)}

      <div class="footer">
        <p>This document was generated automatically from the medical management system.</p>
        <p>For questions or updates, please contact the medical administration office.</p>
      </div>
    </body>
    </html>
  `;
}

function getCommonStyles(): string {
  return `
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      padding: 30px;
      border-radius: 10px;
      margin-bottom: 30px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 2.5em;
      font-weight: 300;
    }
    .header p {
      margin: 10px 0 0 0;
      opacity: 0.9;
      font-size: 1.1em;
    }
    .section {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 25px;
      margin-bottom: 25px;
    }
    .section h2 {
      color: #1e293b;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 10px;
      margin-top: 0;
      font-size: 1.4em;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 15px;
      margin-top: 15px;
    }
    .info-item {
      background: white;
      padding: 15px;
      border-radius: 6px;
    }
    .info-item strong {
      color: #1e293b;
      display: block;
      margin-bottom: 5px;
      font-size: 0.9em;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .info-item span {
      color: #64748b;
      font-size: 1.1em;
    }
    .full-width {
      grid-column: 1 / -1;
    }
    .appointment-item {
      background: white;
      padding: 15px;
      border-radius: 6px;
      margin-bottom: 15px;
    }
    .appointment-item h4 {
      margin: 0 0 10px 0;
      color: #1e293b;
      text-transform: capitalize;
    }
    .appointment-status {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8em;
      font-weight: bold;
      text-transform: uppercase;
    }
    .status-scheduled { background: #eff6ff; color: #2563eb; }
    .status-completed { background: #d1fae5; color: #059669; }
    .status-cancelled { background: #fee2e2; color: #dc2626; }
    .status-no-show { background: #fef3c7; color: #d97706; }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding: 20px;
      color: #64748b;
      border-top: 1px solid #e2e8f0;
    }
    @media print {
      body { margin: 0; }
      .section { break-inside: avoid; }
    }
  `;
}

function generateAccountSection(user: any): string {
  const formatDate = (dateString: string) => {
    return dateString
      ? new Date(dateString).toLocaleDateString()
      : "Not provided";
  };

  return `
    <div class="section">
      <h2>Account Information</h2>
      <div class="info-grid">
        <div class="info-item">
          <strong>Role</strong>
          <span style="text-transform: capitalize">${
            user.profile?.role || user.userType || "User"
          }</span>
        </div>
        <div class="info-item">
          <strong>Status</strong>
          <span style="text-transform: capitalize">${
            user.profile?.status || user.status || "Active"
          }</span>
        </div>
        <div class="info-item">
          <strong>Member Since</strong>
          <span>${formatDate(user.created_at)}</span>
        </div>
        <div class="info-item">
          <strong>Strikes</strong>
          <span>${user.profile?.strikes || 0}</span>
        </div>
      </div>
    </div>
  `;
}

function generateAppointmentSection(
  appointments: any[],
  userType: "doctor" | "patient"
): string {
  const formatDateTime = (dateString: string) => {
    return dateString ? new Date(dateString).toLocaleString() : "Not provided";
  };

  return `
    <div class="section">
      <h2>Appointment History</h2>
      ${
        appointments.length === 0
          ? '<p style="text-align: center; color: #64748b; padding: 20px;">No appointments found</p>'
          : appointments
              .map(
                (appointment) => `
          <div class="appointment-item">
            <h4>${appointment.type || "General Appointment"}</h4>
            <p><strong>Date:</strong> ${formatDateTime(
              appointment.appointment_date
            )}</p>
            <p><strong>Duration:</strong> ${
              appointment.duration_minutes || 30
            } minutes</p>
            <p><strong>Status:</strong> <span class="appointment-status status-${
              appointment.status
            }">${appointment.status}</span></p>
            ${
              userType === "doctor" && appointment.patient
                ? `<p><strong>Patient:</strong> ${appointment.patient.first_name} ${appointment.patient.last_name}</p>`
                : ""
            }
            ${
              userType === "patient" && appointment.doctor
                ? `<p><strong>Doctor:</strong> Dr. ${
                    appointment.doctor.first_name || appointment.doctor.name
                  }</p>`
                : ""
            }
            ${
              appointment.notes
                ? `<p><strong>Notes:</strong> ${appointment.notes}</p>`
                : ""
            }
            ${
              appointment.cancellation_reason
                ? `<p><strong>Cancellation Reason:</strong> ${appointment.cancellation_reason}</p>`
                : ""
            }
          </div>
        `
              )
              .join("")
      }
    </div>
  `;
}

function generateStatisticsSection(appointments: any[]): string {
  return `
    <div class="section">
      <h2>Appointment Statistics</h2>
      <div class="info-grid">
        <div class="info-item">
          <strong>Total Appointments</strong>
          <span>${appointments.length}</span>
        </div>
        <div class="info-item">
          <strong>Completed</strong>
          <span>${
            appointments.filter((a) => a.status === "completed").length
          }</span>
        </div>
        <div class="info-item">
          <strong>Scheduled</strong>
          <span>${
            appointments.filter((a) => a.status === "scheduled").length
          }</span>
        </div>
        <div class="info-item">
          <strong>Cancelled</strong>
          <span>${
            appointments.filter((a) => a.status === "cancelled").length
          }</span>
        </div>
      </div>
    </div>
  `;
}
