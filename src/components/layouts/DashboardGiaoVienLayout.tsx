import DashboardBaseLayout from './DashboardBaseLayout';
import React from 'react';
import PeopleIcon from '@material-ui/icons/People';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import { ViewList, ExitToApp } from '@material-ui/icons';
import { useRouter } from 'next/router';
const baseUrl = '/giaovien';

function Tab({ selected }: { selected?: string }) {
  const router = useRouter();
  const goTo = (url: string) => () => router.push(url);
  return (
    <>
      <div>
        <Divider />
        <ListSubheader inset>Giáo viên</ListSubheader>
        <ListItem button onClick={goTo('/auth/giaovien/signin')}>
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
        <Divider />
      </div>
    </>
  );
}

const DashboardGiaoVienLayout = ({
  title,
  children,
  selectedMenu,
}: {
  title?: string;
  children?: JSX.Element;
  selectedMenu?: string;
}) => {
  return (
    <DashboardBaseLayout title={!!title ? title : 'Giáo viên'} tabs={<Tab selected={selectedMenu} />}>
      {children}
    </DashboardBaseLayout>
  );
};

export default DashboardGiaoVienLayout;
