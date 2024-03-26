import { Card, Stack, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'
import { Certificate } from '../Pdf'

function Resubmit({ textMessage, link, approve, data }) {

    return (
        <>{!approve &&
            <Card
                spacing={3}
                direction="row"
                sx={{
                    width: "100%",
                    px: 3,
                    py: 5,
                    borderRadius: 2,
                }}
            >
                <Stack spacing={0.5}>
                    <Typography variant="h4">{textMessage} {link && <Link>Check Here</Link>}</Typography>
                </Stack>
            </Card>}

            <div>
                {approve &&
                    <Certificate
                        college={data.college.college_name}
                        studentName={data.student.student_name}
                        studentId={data.student.student_id}
                        branch={data.college.college_branch}
                        sem={data.student.student_sem}
                        hrName={data.hr.hr_name}
                        companyName={data.company.company_name}
                        companyLocation={data.company.company_location}
                        internship_staring_date={data.internship_starting_date}
                        internship_ending_date={data.internship_ending_date}
                        applicationApprove={data.updatedAt}
                    />
                }
            </div>
        </>
    )
}

export default Resubmit