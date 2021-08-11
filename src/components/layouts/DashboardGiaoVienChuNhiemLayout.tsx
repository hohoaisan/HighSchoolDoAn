import DashboardBaseLayout from './DashboardBaseLayout';
import React from 'react';
import PeopleIcon from '@material-ui/icons/People';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import { ViewList, LocalLibrary, Contacts, ExitToApp } from '@material-ui/icons';
import { useRouter } from 'next/router';
const baseUrl = '/gvcn';

function Tab({ selected }: { selected?: string }) {
  const router = useRouter();
  const goToSigninPage = () => {
    router.push('/auth/giaovien/signin');
  };
  return (
    <>
      <div>
        <Divider />
        <ListSubheader inset>Giáo viên chủ nhiệm</ListSubheader>
        <ListItem button onClick={goToSigninPage}>
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Đăng nhập" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <ViewList />
          </ListItemIcon>
          <ListItemText primary="Xem danh sách các lớp" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <LocalLibrary />
          </ListItemIcon>
          <ListItemText primary="Xem học bạ học sinh" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <Contacts />
          </ListItemIcon>
          <ListItemText primary="Cập nhật học bạ học sinh" />
        </ListItem>
        <Divider />
      </div>
    </>
  );
}

const DashboardGiaoVienChuNhiem = ({
  title,
  children,
  selectedMenu,
}: {
  title?: string;
  children?: JSX.Element;
  selectedMenu?: string;
}) => {
  return (
    <DashboardBaseLayout title={!!title ? title : 'Giáo viên chủ nhiệm'} tabs={<Tab selected={selectedMenu} />}>
      {children}
    </DashboardBaseLayout>
  );
};

export default DashboardGiaoVienChuNhiem;
