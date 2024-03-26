import { Button, Hidden } from '@mui/material';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useRef } from 'react';
import charusat from '../../../public/assets/charusat_logo.jpg';
import cspit from '../../../public/assets/cspit_logo.jpg';
import './style.css';

function Certificate(
  {
    college,
    studentName,
    studentId,
    branch,
    sem,
    hrName,
    companyName,
    companyLocation,
    internship_staring_date,
    internship_ending_date,
    applicationApprove
  }
) {

  const certificateRef = useRef(null);
  const generatePdf = () => {
    const certificate = certificateRef.current;

    html2canvas(certificate).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF();
      const imgWidth = 210;
      const imgHeight = 297;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('certificate.pdf');
    });
  };


  // const localApplicationDate = applicationApprove;
  const localApplicationDate = applicationApprove.split('T')[0].split('-').reverse().join('-');;
  const staringDate = internship_ending_date.split('T')[0].split('-').reverse().join('-');;
  const endingDate = internship_staring_date.split('T')[0].split('-').reverse().join('-');;
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: "10px" }}>
        <Button variant='contained' color='primary' onClick={generatePdf}>Download</Button>
      </div>

      <div className="certificate" ref={certificateRef} >
        <div className="college_header_data">
          <div className="college_logo">
            <img src={charusat} alt="Charusat Logo" />
          </div>
          <div className="college_name">
            <h3>
              <span>CHARUSAT</span><br /> {college} <br /> Smt. Kundanben Dinsha Patel Department of <br /> Information
              Technology
            </h3>
          </div>
          <div className="college_logo">
            <img src={cspit} alt="CSPIT Logo" />
          </div>
        </div>
        <div className="college_data">
          <div className="student_data">CSPIT/IT/TOP/4-<span>INT-2024-25/{studentId}</span></div>
          <div className="application_date">Date : {localApplicationDate}</div>
        </div>
        <div className="letter_content">
          <p className="hr_information">
            <span>To,</span><br />
            {hrName}<br />
            {companyName}<br />
            {companyLocation}
          </p>
          <div className="noc_subject">
            <p className="noc_subject_data">
              <span>Subject :</span>
              <u> NOC {sem}th Sem Summer Internship at your Organization</u>
            </p>
          </div>
          <div className="noc_main_data_section">
            <div className="noc_data">

              <p><strong>Dear Sir/Madam,</strong></p>

              <p className="noc_content">
                {college == "CSPIT" ? "Chandubhai.S.Patel Institute of Technology" : "Devang Patel Institute of Advance Technology and Research"}, Changa {college} is a graduate degree engineering
                college
                affiliated to Charotar University of Science and Technology (CHARUSAT). We run full time Degree
                &
                Post graduate programs in Electronics & Communication Engineering, Computer Engineering,
                Information
                Technology Electrical engineering, Mechanical and Civil Engineering.
              </p>

              <p className="noc_content">
                The students of semester {sem}th of Smt. KundanbenDinsha Patel Department of Information
                Technology of our Institute are required to undergo industrial training as a part of their
                academic course content
                of the University.
              </p>

              <p className="noc_content">
                This is to certify that the Institute does not have any objection, if our student {studentName}
                ({studentId}) of {branch} Department undergoes project internship at your Organization
                from <br />{staringDate} to {endingDate}
              </p>

              <p className="noc_content">
                In case any issue arises, it should be immediately brought to the notice of the
                Training & Placement Officer in the department.
              </p>

              <p>
                Thanks and Regards..!
              </p>

              <p className="college_contact_details">
                Training & Placement Officer. <br />
                CHARUSAT, Changa <br />
                Tel: 02697265213 <br />
                Email: <span>tnp@charusat.ac.in</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Certificate;
