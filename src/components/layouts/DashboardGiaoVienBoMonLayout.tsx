import DashboardBaseLayout from './DashboardBaseLayout';
import React from 'react';
import PeopleIcon from '@material-ui/icons/People';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import { ViewList } from '@material-ui/icons';
import { useRouter } from 'next/router';
const baseUrl = '/gvbomon';

function Tab({ selected }: { selected?: string }) {
  const router = useRouter();
  return (
    <>
      <div>
        <Divider />
        <ListSubheader inset>Giáo viên bộ môn</ListSubheader>
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

const DashboardGiaoVienBoMonLayout = ({
  title,
  children,
  selectedMenu,
}: {
  title?: string;
  children?: JSX.Element;
  selectedMenu?: string;
}) => {
  return (
    <DashboardBaseLayout title={!!title ? title : 'Giáo viên bộ môn'} tabs={<Tab selected={selectedMenu} />}>
      {children}
    </DashboardBaseLayout>
  );
};

export default DashboardGiaoVienBoMonLayout;
