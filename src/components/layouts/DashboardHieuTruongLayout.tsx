import DashboardBaseLayout from './DashboardBaseLayout';
import React from 'react';
import PeopleIcon from '@material-ui/icons/People';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import { ViewList, LocalLibrary, Equalizer, DateRange, ExitToApp } from '@material-ui/icons';
import { useRouter } from 'next/router';
const baseUrl = '/hieutruong';

function Tab({ selected }: { selected?: string }) {
  const router = useRouter();
  const goToSigninPage = () => {
    router.push('/auth/giaovien/signin');
  };
  return (
    <>
      <div>
        <Divider />
        <ListSubheader inset>Hiệu trưởng</ListSubheader>
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
            <Equalizer />
          </ListItemIcon>
          <ListItemText primary="Thống kê" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <DateRange />
          </ListItemIcon>
          <ListItemText primary="Quản lí năm học" />
        </ListItem>
        <Divider />
      </div>
    </>
  );
}

const DashboardHieuTruongLayout = ({
  title,
  children,
  selectedMenu,
}: {
  title?: string;
  children?: JSX.Element;
  selectedMenu?: string;
}) => {
  return (
    <DashboardBaseLayout title={!!title ? title : 'Hiệu trưởng'} tabs={<Tab selected={selectedMenu} />}>
      {children}
    </DashboardBaseLayout>
  );
};

export default DashboardHieuTruongLayout;
