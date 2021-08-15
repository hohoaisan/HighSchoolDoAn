import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingMessage, ServerResponse } from 'http';
import withSession from 'libs/withSession';

import prisma from 'db/prisma';

import CookieBody from 'interfaces/CookieBody';
import UserType from 'enums/UserType';
import UserInfo from 'interfaces/UserInfo';

export default withSession(async function handler(req: any, res: NextApiResponse) {
  const cookie_user: CookieBody = req.session.get('user');
  if (!cookie_user) return res.status(403).end();
  if (cookie_user.type !== UserType.GIAOVIEN) return res.status(403).end();
  const id = cookie_user.id;
  const namHoc = await prisma.namHoc.findMany({
    orderBy: {
      maNamHoc: 'desc',
    },
  });

  let lopChuNhiem = await prisma.lopChuNhiem.findMany({
    select: {
      maGiaoVien: true,
      maLopChuNhiem: true,
      maNamHoc: true,
      Lop: {
        select: {
          maLop: true,
          tenLop: true,
        },
      },
    },
    where: {
      maGiaoVien: id,
    },
    orderBy: {
      maNamHoc: 'desc',
    },
  });
  res.status(200).json({ namHoc, lopChuNhiem });
});
