import SvgColor from 'src/components/svg-color';
// ----------------------------------------------------------------------
import { IoHome } from "react-icons/io5";
import { GrHistory } from "react-icons/gr";
import { MdOutlineVerified } from "react-icons/md";
import { MdOutlinePendingActions } from "react-icons/md";
import { TbCertificateOff } from "react-icons/tb";
import { CgProfile } from "react-icons/cg";

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />

);

const navConfig = [
  
  {
    title: 'Pending Certificate',
    path: '/PendingCertificate',
    icon: <MdOutlinePendingActions  fontSize={"20px"}/>,
    admin:true
  },
  {
    title: 'Approved Certificate',
    path: '/ApproveCertificate',
    icon: <MdOutlineVerified fontSize={"20px"}/>,
    admin:true
  },
  {
    title: 'Reject Certificate',
    path: '/RejectCertificate',
    icon: <TbCertificateOff fontSize={"20px"}/>,
    admin:true
  },
  {
    title: 'My Certificate',
    path: '/mycertificate',
    icon: <GrHistory fontSize={"20px" }/>,
  },
  {
    title: 'Profile',
    path: '/Profile',
    icon: <CgProfile fontSize={"20px"}/>,
  }
];

export default navConfig;
