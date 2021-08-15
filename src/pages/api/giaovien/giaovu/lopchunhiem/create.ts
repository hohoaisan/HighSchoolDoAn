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
  let { maGiaoVien, maLop } = await req.body;
  maGiaoVien = Number.parseInt(maGiaoVien);
  maLop = Number.parseInt(maLop);
  // maNamHoc = Number.parseInt(maNamHoc);
  const maNamHoc = (
    await prisma.namHoc.findMany({
      select: {
        maNamHoc: true,
      },
      take: 1,
      orderBy: {
        maNamHoc: 'desc',
      },
    })
  )[0].maNamHoc;
  const result = await prisma.lopChuNhiem.create({
    data: {
      maGiaoVien,
      maLop,
      maNamHoc,
    },
  });
  res.status(200).json(result);
});
