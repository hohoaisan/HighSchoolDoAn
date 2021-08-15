import type { NextApiRequest, NextApiResponse } from 'next';
import { IncomingMessage, ServerResponse } from 'http';
import withSession from 'libs/withSession';

import prisma from 'db/prisma';

import CookieBody from 'interfaces/CookieBody';
import UserType from 'enums/UserType';

export default withSession(async function handler(req: any, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(400).end();
  const cookie_user: CookieBody = req.session.get('user');
  if (!cookie_user) return res.status(403).end();
  if (cookie_user.type !== UserType.GIAOVIEN) return res.status(403).end();
  // const id = cookie_user.id;
  const lopChuNhiem: number = Number.parseInt(req.query.lop);
  const { maHocSinh, maLopChuNhiem } = await req.body;
  if (lopChuNhiem !== maLopChuNhiem) return res.status(400).end();
  const lop = await prisma.lopChuNhiem.findUnique({
    select: {
      maLopChuNhiem: true,
    },
    where: {
      maLopChuNhiem: lopChuNhiem,
    },
  });
  if (lop === null) return res.status(404).end();
  const hocSinh = await prisma.hocSinh.findUnique({
    select: {
      maHocSinh: true,
    },
    where: {
      maHocSinh: maHocSinh,
    },
  });
  if (hocSinh == null) return res.status(404).end();
  const result = await prisma.hocBa.create({
    data: {
      maLopChuNhiem: lopChuNhiem,
      maHocSinh: maHocSinh,
    },
  });
  res.status(200).json(result);
});
