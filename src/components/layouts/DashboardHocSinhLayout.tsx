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

const baseUrl = '/hocsinh';

function Tab({ selected }: { selected?: string }) {
  const router = useRouter();
  return (
    <>
      <div>
        <Divider />
        <ListSubheader inset>Học sinh</ListSubheader>
        <ListItem button>
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

const DashboardHocSinhLayout = ({
  title,
  children,
  selectedMenu,
}: {
  title?: string;
  children?: JSX.Element;
  selectedMenu?: string;
}) => {
  return (
    <DashboardBaseLayout title={!!title ? title : 'Học sinh'} tabs={<Tab selected={selectedMenu} />}>
      {children}
    </DashboardBaseLayout>
  );
};

export default DashboardHocSinhLayout;
